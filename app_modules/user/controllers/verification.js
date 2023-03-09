const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const ValidationService = require('../services/validation')
const RedisService = require('../../../lib/redis_service/redisService')
const UserService = require('../services/dbData')

const otp = (req, res) => {
  __logger.info('otp ::>>>>>>..')
  const validatonService = new ValidationService()
  const userService = new UserService()
  const redisService = new RedisService()
  validatonService.checkOtp(req.body)
    .then(data => {
      __logger.info('otp :: data::>>>>>>.. then 1', data)
      return redisService.getOtpCode(req.body.userId, req.body.code)
    })
    .then(data => {
      var code = parseInt(data)
      __logger.info('otp :: data::>>>>>>.. then 2', data)
      if (req.body.code === code) {
        return userService.updateotpVerifed(req.body.userId)
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.INVALID_OTP, err: 'Please enter a valid code' })
      }
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { userId: req.body.userId } })
    })
    .catch(err => {
      __logger.error('error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || {} })
    })
}

module.exports = otp
