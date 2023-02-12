const buttonsValue = [
  'C',
  '√',
  '%',
  '/',
  '7',
  '8',
  '9',
  '×',
  '4',
  '5',
  '6',
  '-',
  '1',
  '2',
  '3',
  '+',
  '00',
  '0',
  ',',
  '=',
];
const figures = buttonsValue.filter((button) => !isNaN(button) || button === ',');
const binaryOperators = ['+', '-', '×', '/'];
const unaryOperators = ['√', '%'];
const keyBoard = [...buttonsValue, 'Enter', 'Delete', '*'];

const buttons = document.querySelector('#buttons');
let leftOperand = '';
let rightOperand = '';
let operation = '';
let output = '';
let done = false;
const result = document.querySelector('#result');
const enter = document.querySelector('#enter');

buttonsValue.forEach((value) => {
  const button = document.createElement('div');
  if (value === '=') {
    button.classList.add('button_equal');
  }

  button.classList.add('button');
  button.innerText = value;
  buttons.append(button);
});

buttons.addEventListener('click', (event) => {
  const target = event.target.innerText;
  if (!event.target.classList.contains('button')) {
    return;
  }
  handle(target);
});

document.addEventListener('keydown', (event) => {
  if (keyBoard.includes(event.key)) {
    let target = event.key;

    const createAdditionalButtons = () => {
      switch (target) {
        case '*':
          target = '×';
          break;
        case 'Enter':
          target = '=';
          break;
        case 'Delete':
          target = 'C';
          break;
      }
    };
    createAdditionalButtons();

    const buttons = document.querySelectorAll('.button');

    const toggleActiveClassToKey = (buttons) => {
      buttons.forEach((button) => {
        if (target === button.innerText) {
          button.classList.add('active');

          const timeid = setTimeout(() => {
            button.classList.remove('active');
            clearTimeout(timeid);
          }, 500);
        }
      });
    };
    toggleActiveClassToKey(buttons);

    handle(target);
  }
});

const handle = (target) => {
  enter.innerText = '';
  result.innerText = '';

  if (target === 'C') {
    clear();
    return;
  }

  if (figures.includes(target)) {
    setOperands(target);
  }

  if (binaryOperators.includes(target)) {
    setOperation(target);
  }

  if (unaryOperators.includes(target)) {
    pressSpecial(target);
  }

  showEnter(target);

  if (target === '=') {
    pressEqual();
    output = result.innerText;
  }
};

const clear = () => {
  result.innerText = 0;
  enter.innerText = 0;
  output = '';
  leftOperand = '';
  rightOperand = '';
  operation = '';
  done = false;
};

const addZero = () => {
  if (leftOperand === '.') {
    leftOperand = '0.';
  }
  if (rightOperand === '.') {
    rightOperand = '0.';
  }
};

const setOperands = (target) => {
  if (target === ',') {
    target = '.';
  }

  const removeExtraDots = (operand) => {
    if (target === '.' && String(operand).includes('.')) {
      target = '';
    }
  };

  const removeZeroWithoutValue = (operand) => {
    if (operand === leftOperand) {
      if (target === '00' && (leftOperand === '0' || leftOperand === '')) {
        leftOperand = 0;
        target = '';
      }
      if (target === '0' && leftOperand == '0') {
        target = '';
      } else if (target !== '0' && leftOperand === '0') {
        leftOperand = '';
      }
    } else {
      if (target === '00' && (rightOperand === '0' || rightOperand === '')) {
        rightOperand = 0;
        target = '';
      }
      if (target === '0' && rightOperand == '0') {
        target = '';
      } else if (target !== '0' && rightOperand === '0') {
        rightOperand = '';
      }
    }
  };

  const isEmptyValue = rightOperand === '' && operation === '';
  const haveBeenCalculation = leftOperand && rightOperand && done;
  if (isEmptyValue) {
    removeExtraDots(leftOperand);
    removeZeroWithoutValue(leftOperand);
    leftOperand += target;
    addZero();
    formattedResult(leftOperand);
  } else if (haveBeenCalculation) {
    done = false;
    if (target === '00') {
      target = '0';
    }

    rightOperand = target;
    addZero();
    formattedResult(rightOperand);
  } else {
    removeExtraDots(rightOperand);
    removeZeroWithoutValue(rightOperand);
    rightOperand += target;
    addZero();
    formattedResult(rightOperand);
  }
};

const setOperation = (target) => {
  const calcWithoutEqual = leftOperand && rightOperand && operation && !done;

  if (calcWithoutEqual) {
    pressEqual();
  }

  operation = target;
  result.innerText = operation;
};

const showEnter = (target) => {
  const lastKey = output[output.length - 1];
  const penultKey = output[output.length - 2];

  const clearAfterUnary = () => {
    if (unaryOperators.includes(lastKey)) {
      if (!binaryOperators.includes(target) && !unaryOperators.includes(target)) {
        clear();
        setOperands(target);
      }
      if (target === '=') {
        clear();
      }
    }
  };
  clearAfterUnary();

  const isEmptyOutput = output === '0' || output === '';

  const isFigure = () => {
    if (!isNaN(target)) {
      const rigthOperandStartFromZero = lastKey === '0' && binaryOperators.includes(penultKey);

      const removeFirstZero = () => {
        if (target === '00' || target === '0') {
          if (isEmptyOutput) {
            output = '0';
            target = '';
          }

          if (binaryOperators.includes(lastKey)) {
            output += '0';
            target = '';
          }

          if (rigthOperandStartFromZero) {
            target = '';
          }
        } else if (target !== '0' && rigthOperandStartFromZero) {
          output = output.slice(0, -1);
        } else if (target != '0' && output === '0') {
          output = '';
        }
      };
      removeFirstZero();

      output += target;
    }
  };
  isFigure();

  const isBinary = () => {
    if (binaryOperators.includes(target)) {
      if (!binaryOperators.includes(lastKey)) {
        output += target;
      } else {
        output = output.slice(0, -1) + target;
      }
      if (lastKey === ',') {
        output = output.slice(0, -2) + target;
      }
    }
  };
  isBinary();

  const isUnary = () => {
    if (unaryOperators.includes(target)) {
      if (output === '') {
        output = '0';
      }
      if (lastKey === ',') {
        output = output.slice(0, -1);
      }

      output += target;
    }
  };
  isUnary();

  const isComma = () => {
    const removeExtraCommaAfterBinary = () => {
      let index;
      output.split('').forEach((key, i) => {
        if ('+-×/'.includes(key)) {
          index = i;
        }
      });

      if (output.slice(index).includes(',')) {
        target = '';
      }
    };

    if (target === ',') {
      if (isEmptyOutput) {
        output = '0';
      }
      if (lastKey === ',') {
        output = output.slice(0, -1);
      }

      removeExtraCommaAfterBinary();

      if (binaryOperators.includes(lastKey)) {
        output += '0';
      }

      output += target;
    }

    enter.innerText = output;
  };
  isComma();
};

const formattedResult = (operand) => {
  result.innerText = String(operand).replace('.', ',').slice(0, 15);
};

const pressEqual = () => {
  if (rightOperand === '') {
    rightOperand = leftOperand;
  }

  doOperation();
  done = true;
  formattedResult(leftOperand);
  if (leftOperand === '') {
    result.innerText = '0';
    enter.innerText = '0';
  }
};

const pressSpecial = (target) => {
  switch (target) {
    case '√':
      if (rightOperand && !done) {
        rightOperand = Math.sqrt(rightOperand);
        formattedResult(rightOperand);
      } else {
        leftOperand = Math.sqrt(leftOperand);
        formattedResult(leftOperand);
      }
      break;
    case '%':
      if (rightOperand) {
        rightOperand = rightOperand * leftOperand * 0.01;
        formattedResult(rightOperand);
      } else {
        leftOperand = leftOperand * 0.01;
        formattedResult(leftOperand);
      }
  }
};

const doOperation = () => {
  switch (operation) {
    case '+':
      leftOperand = +(Number(leftOperand) + Number(rightOperand)).toFixed(10);
      break;
    case '-':
      leftOperand = +(leftOperand - rightOperand).toFixed(10);
      break;
    case '×':
      leftOperand = +(leftOperand * rightOperand).toFixed(10);
      break;
    case '/':
      if (rightOperand === '0') {
        clear();
        result.innerText = 'Error';
        return;
      }
      leftOperand = +(leftOperand / rightOperand).toFixed(10);
      console.log(leftOperand);
      break;
  }
};
