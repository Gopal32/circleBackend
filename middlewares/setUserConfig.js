const __db = require('../lib/db')
const q = require('q')
const UserService = require('../app_modules/user/services/dbData')
const __util = require('../lib/util')
const __constants = require('../config/constants')
const __logger = require('../lib/logger')

const setDataInRedis = userId => {
  const dataSet = q.defer()
  let userData = {}
  const userService = new UserService()
  userService.getUserDetails(userId)
    .then(dbData => {
      userData = dbData
      return __db.redis.set(`${__constants.REDIS_KEY.USER_DETAILS}${userId}`, JSON.stringify(userData))
    })
    .then(result => dataSet.resolve(userData))
    .catch(err => dataSet.reject(err))
  return dataSet.promise
}

const getRedisDataStatus = userId => {
  const dataExists = q.defer()
  __db.redis.get(`${__constants.REDIS_KEY.USER_DETAILS}${userId}`)
    .then(data => {
      if (data) {
        dataExists.resolve({ exists: true, data: JSON.parse(data) })
      } else {
        dataExists.resolve({ exists: false, data: {} })
      }
    })
    .catch(err => dataExists.reject(err))
  return dataExists.promise
}

const setUserConfig = (req, res, next) => {
  const userId = req.user && req.user.userId ? req.user.userId : null
  if (!userId) return next()
  getRedisDataStatus(userId)
    .then(redisData => {
      if (redisData.exists) {
        return redisData.data
      } else {
        return setDataInRedis(userId)
      }
    })
    .then(userConfig => {
      req.userConfig = userConfig
      return next()
    })
    .catch(err => {
      __logger.info('err', err)
      __util.send(res, { type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
    })
}

module.exports = { setUserConfig, getRedisDataStatus }
