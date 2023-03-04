const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const __constants = require('../../../config/constants')
// const ValidatonService = require('./validation')
// const rejectionHandler = require('../../../lib/util/rejectionHandler')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const __logger = require('../../../lib/logger')
// const _ = require('lodash')
// const AgreementStatusEngine = require('../services/status')

class MappedData {
  constructor () {
    this.uniqueId = new UniqueId()
  }

  getListOfPlan () {
    __logger.info('dbData: getListOfPlan(): ')
    const insertFollower = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getListOfPlan(), [])
      .then(result => {
        __logger.info('dbData: getListOfPlan(): then 1:', result)
        if (result && result.length > 0) {
          insertFollower.resolve(result)
        } else {
          insertFollower.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get plan list function: ', err)
        insertFollower.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return insertFollower.promise
  }
}

module.exports = MappedData
