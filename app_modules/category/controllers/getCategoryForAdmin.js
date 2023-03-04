const __logger = require('../../../lib/logger')
const __db = require('../../../lib/db')
const __constants = require('../../../config/constants')
const queryProvider = require('../queryProvider')
const __util = require('../../../lib/util')
const formatData = require('../../../lib/util/formatData')

const getCategoryForAdmin = (req, res) => {
  __logger.info('Inside getCategoryForAdmin')
  __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getCategorywithPostAndFollower(), [])
    .then(data => {
      if (data && data.length > 0) {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: formatData(data) })
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND })
      }
    })
    .catch(err => {
      __logger.error('error in getCategoryForAdmin function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getCategoryForAdmin
