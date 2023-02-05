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

const buttons = document.querySelector('#buttons');

buttonsValue.forEach((value) => {
  const button = document.createElement('div');
  if (value === '=') {
    button.classList.add('button_equal');
  }

  button.classList.add('button');
  button.innerText = value;
  buttons.append(button);
});
