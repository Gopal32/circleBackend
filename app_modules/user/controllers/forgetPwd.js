const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const UserService = require('../services/dbData')
const emailValidator = require('deep-email-validator')
const VerificationService = require('../services/verification')

const forgetPwd = (req, res) => {
  __logger.info('Inside forgetPwd')
  const userService = new UserService()
  const verificationService = new VerificationService()
  let userId
  emailValidator.validate(req.body.email)
    .then(data => {
      __logger.info('forgetPwd function', data)
      if (data && data?.validators?.regex && data?.validators?.mx?.valid) {
        return userService.getUserDataByEmail(req.body.email, true)
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.EMAIL_NOT_VALID, data: {} })
      }
    })
    .then(data => {
      if (data && data.length > 0) {
        return verificationService.addVerificationCode(data[0].userId, __constants.VERIFICATION_CHANNEL.email.expiresIn, __constants.VERIFICATION_CHANNEL.email.codeLength)
      } else {
        __util.send(res, { type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST })
      }
    })
    .then(data => {
      if (data) {
        userId = data.userId
        return verificationService.sendVerificationCodeByEmail(data.code, req.body.email)
      }
    })
    .then(data => {
      __logger.info('forgetPwd function :: Then 1', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.EMAIL_VC, data: { userId } })
    })
    .catch(err => {
      __logger.error('forgetPwd function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = forgetPwd
