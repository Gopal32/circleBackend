const __logger = require('../../../lib/logger')
const ValidationService = require('../services/validation')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const UserService = require('../../user/services/dbData')

const selectPlan = (req, res) => {
  __logger.info('Inside selectPlan')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const userService = new UserService()
  const validationService = new ValidationService()
  validationService.checkPlanName(req.body)
    .then(() => {
      return userService.updatePlan(userId, __constants.SUBSCRIPTION[req.body.planName])
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { userId, planId: data, planName: req.body.planName } })
    })
    .catch(err => {
      __logger.error('error in getCategory function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = selectPlan
