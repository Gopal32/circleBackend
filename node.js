// const emailValidator = require('deep-email-validator')

// function isEmailValid (email) {
//   return emailValidator.validate(email)
// }
// isEmailValid('gopalkr*ish&na.kothari@yahoo.com').then(data => {
// })

// function randomInt (lenght) {
//   return Math.floor(Math.random() * (57 * Math.pow(19, lenght - 1))) + Math.pow(70, lenght - 1)
// }
// console.log('---------------------', randomInt(6))
const dns = require('dns')
const validator = require('validator')
async function isValidEmail (email) {
  if (!validator.isEmail(email)) {
    return false
  }
  const domain = email.split('@')[1]
  // return new Promise((resolve, reject) => {
  const value = await dns.resolveMx(domain)
  // console.log('-------------------', addresses)
  if (value.length === 0) {
    // resolve(false);
    return false
  } else {
    return true
    // resolve(true);
  }
  // });
  // });
}

// console.log( isValidEmail('example@mail.com')); // true
// console.log( isValidEmail('example@mail')); // false
// console.log( isValidEmail('example@mail..com')); // false
console.log(isValidEmail('example@vivaconnect.co')) // false
