// const emailValidator = require('deep-email-validator')

// function isEmailValid (email) {
//   return emailValidator.validate(email)
// }
// isEmailValid('gopalkr*ish&na.kothari@yahoo.com').then(data => {
// })

function randomInt (lenght) {
  return Math.floor(Math.random() * (57 * Math.pow(19, lenght - 1))) + Math.pow(70, lenght - 1)
}
console.log('---------------------', randomInt(6))
