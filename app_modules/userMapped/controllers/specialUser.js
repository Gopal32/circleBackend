const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const Service = require('../services/dbData')

const userFollows = (req, res) => {
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  __logger.info('Inside userFollows')
  const service = new Service()
  service.getUserdetails(userId)
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: data })
    })
    .catch(err => {
      __logger.error('error in getCategory function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = userFollows
