function generateRandomCode(length) {
    const codeArray = [];
    const minDigit = 0; // Minimum digit
    const maxDigit = 9; // Maximum digit
  
    for (let i = 0; i < length; i++) {
      const randomDigit = Math.floor(Math.random() * (maxDigit - minDigit + 1)) + minDigit;
      codeArray.push(randomDigit);
    }
  
    const randomCode = codeArray.join('');
    return randomCode;
  }

  module.exports = {generateRandomCode}