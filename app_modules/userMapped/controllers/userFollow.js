const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const Validation = require('../services/validation')
const Service = require('../services/dbData')
const UserService = require('../../user/services/dbData')

const userFollows = (req, res) => {
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  __logger.info('Inside userFollows')
  const validation = new Validation()
  const service = new Service()
  const userService = new UserService()
  validation.checkFollowId(req.params)
    .then(data => {
      return service.insertFollowMapped(userId, req.params.followingId)
    })
    .then(data => {
      return service.addCount(userId, req.params.followingId)
    })
    .then(data => {
      return userService.romoveRedisUserdetials(userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: {} })
    })
    .catch(err => {
      __logger.error('error in getCategory function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = userFollows
