const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const UserService = require('../services/dbData')
const authMiddleware = require('../../../middlewares/auth/authentication')

const setUsername = (req, res) => {
  __logger.info('Inside setUsername')
  const validate = new ValidationService()
  const userService = new UserService()
  const subscriptionId = 'free_plan'
  validate.setUser(req.body)
    .then(data => {
      __logger.info('setUsername function', data)
      return userService.checkUserDetails(req.body.userName)
    })
    .then(data => { return userService.setPassword(req.body.userId, req.body.password) })
    .then(data => { return userService.setUserdetails(req.body.userId, req.body.userName, req.body.fullName, __constants.SUBSCRIPTION[subscriptionId]) })
    .then(data => {
      __logger.info('setUsername function :: Then 1', { data })
      const payload = { userId: req.body.userId, signupType: req.body.signupType, subscriptionId: __constants.SUBSCRIPTION[subscriptionId] }
      const token = authMiddleware.setToken(payload, __constants.CUSTOM_CONSTANT.SESSION_TIME)
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { token: token } })
    })
    .catch(err => {
      __logger.error('setUsername function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = setUsername
