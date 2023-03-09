const UserService = require('../app_modules/user/services/dbData')
const __constants = require('../config/constants')
const checkDays = require('../lib/util/checkTime')

const userPlanConfgiMiddleware = (req, res, next) => {
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const createdOn = req.userConfig && req.userConfig.createdOn ? req.userConfig.createdOn : 0
  // const createdOn = '2023-02-04T11:34:32.000Z'
  if (planId === __constants.SUBSCRIPTION.free_plan) {
    const totalDays = checkDays(createdOn)
    if (totalDays >= 30) {
      const userService = new UserService()
      userService.updatePlan(req.user.userId, planId)
      userService.romoveRedisUserdetials(req.user.userId)
      req.userConfig.planId = __constants.SUBSCRIPTION.basic
      next()
    } else {
      next()
    }
  } else {
    next()
  }
}

module.exports = [userPlanConfgiMiddleware]
