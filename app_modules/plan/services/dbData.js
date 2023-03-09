const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const __constants = require('../../../config/constants')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const __logger = require('../../../lib/logger')

class MappedData {
  constructor () {
    this.uniqueId = new UniqueId()
  }

  getListOfPlan () {
    __logger.info('dbData: getListOfPlan(): ')
    const doesGetPlanList = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getListOfPlan(), [])
      .then(result => {
        __logger.info('dbData: getListOfPlan(): then 1:', result)
        if (result && result.length > 0) {
          doesGetPlanList.resolve(result)
        } else {
          doesGetPlanList.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get plan list function: ', err)
        doesGetPlanList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetPlanList.promise
  }

  getPlanListById (planId) {
    __logger.info('dbData: getPlanListById(): ')
    const doesGetDetails = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getPlanListById(), [planId])
      .then(result => {
        __logger.info('dbData: getPlanListById(): then 1:', result)
        if (result && result.length > 0) {
          doesGetDetails.resolve(result[0])
        } else {
          doesGetDetails.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get plan list by id function: ', err)
        doesGetDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetDetails.promise
  }

  setRedisPlanKey (planId) {
    __logger.info('dbData: setRedisPlanKey(): ')
    const deosSetPlanKey = q.defer()
    let planData
    this.getPlanListById(planId)
      .then(dbData => {
        planData = dbData
        return __db.redis.set(`${__constants.REDIS_KEY.PLAN}${planId}`, JSON.stringify(planData))
      })
      .then(result => deosSetPlanKey.resolve(planData))
      .catch(err => {
        __logger.error('dbData: error in set redis plan key function: ', err)
        deosSetPlanKey.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return deosSetPlanKey.promise
  }

  getRedisPlanKey (planId) {
    __logger.info('dbData: getRedisPlanKey(): ')
    const deosGetPlanKey = q.defer()
    __db.redis.get(`${__constants.REDIS_KEY.PLAN}${planId}`)
      .then(data => {
        if (data) {
          deosGetPlanKey.resolve({ exists: true, data: JSON.parse(data) })
        } else {
          deosGetPlanKey.resolve({ exists: false, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get redis plan key function: ', err)
        deosGetPlanKey.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return deosGetPlanKey.promise
  }

  checkPlan (planId) {
    __logger.info('dbData: checkPlan(): ')
    const doesCheckPlan = q.defer()
    this.getRedisPlanKey(planId)
      .then(result => {
        if (result.exists) {
          return result.data
        } else {
          return this.setRedisPlanKey(planId)
        }
      })
      .then(result => doesCheckPlan.resolve(result))
      .catch(err => {
        __logger.error('dbData: error in check plan function: ', err)
        doesCheckPlan.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckPlan.promise
  }
}

module.exports = MappedData
