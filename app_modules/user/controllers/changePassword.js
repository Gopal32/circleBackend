const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const UserService = require('../services/dbData')
const ValidationService = require('../services/validation')
const rejectionHandler = require('../../../lib/util/rejectionHandler')

const changePassword = (req, res) => {
  const userService = new UserService()
  const validate = new ValidationService()
  __logger.info('Inside change password called: ', req.body)
  validate.changePassword(req.body)
    .then(data => {
      __logger.info('changePassword function', data)
      return userService.getUserDataByUserId(req.body.userId, true)
    })
    .then(data => {
      if (data && data.length > 0) {
        return userService.updatePwd(req.body.userId, req.body.newPassword, data[0].saltKey)
      } else {
        return rejectionHandler({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, err: {} })
      }
    })
    .then(data => __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: {} }))
    .catch(err => {
      __logger.error('error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || {} })
    })
}

module.exports = changePassword
