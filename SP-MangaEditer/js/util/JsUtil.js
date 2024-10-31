function generateRandomInt(maxValue) {
  const intMaxValue = parseInt(maxValue, 10);
  if (isNaN(intMaxValue)) {
      return 0;
  }
  return parseInt(Math.floor(Math.random() * (intMaxValue + 1)), 10);
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

