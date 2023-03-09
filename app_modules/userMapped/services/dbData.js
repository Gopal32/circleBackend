const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const categoryQueryProvider = require('../../category/queryProvider')
const __constants = require('../../../config/constants')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const __logger = require('../../../lib/logger')

class MappedData {
  constructor () {
    this.uniqueId = new UniqueId()
  }

  insertFollowMapped (userId, followingId) {
    __logger.info('dbData: insertFollowMapped(): ', userId, followingId)
    const userFollowMappingId = this.uniqueId.uuid()
    const insertFollower = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.insertFollowMapped(), [userFollowMappingId, followingId, userId])
      .then(result => {
        __logger.info('dbData: insertFollowMapped(): then 1:', result)
        if (result && result.affectedRows === 1) {
          insertFollower.resolve(result)
        } else {
          insertFollower.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in insert user follow mapped function: ', err)
        insertFollower.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return insertFollower.promise
  }

  addCount (userId, followingId) {
    __logger.info('dbData: addCount(): ', userId, followingId)
    const doesAddCount = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.addCount(), [userId, followingId])
      .then(result => {
        __logger.info('dbData: addCount(): then 1:', result)
        if (result && result[0].affectedRows > 0 && result[1].affectedRows > 0) {
          doesAddCount.resolve(result)
        } else {
          doesAddCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in add follower count function: ', err)
        doesAddCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesAddCount.promise
  }

  deleteFollowMapped (userId, followingId) {
    __logger.info('dbData: deleteFollowMapped(): ', userId, followingId)
    const doesdeleteFollow = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.deleteFollowMapped(), [userId, followingId])
      .then(result => {
        __logger.info('dbData: deleteFollowMapped(): then 1:', result)
        if (result && result.affectedRows === 1) {
          doesdeleteFollow.resolve(result)
        } else {
          doesdeleteFollow.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in delete user follow mapped function: ', err)
        doesdeleteFollow.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesdeleteFollow.promise
  }

  removeCount (userId, followingId) {
    __logger.info('dbData: removeCount(): ', userId, followingId)
    const doesRemoveCount = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.removeCount(), [userId, followingId])
      .then(result => {
        __logger.info('dbData: removeCount(): then 1:', result)
        if (result && result[0].affectedRows > 0 && result[1].affectedRows > 0) {
          doesRemoveCount.resolve(result)
        } else {
          doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in remove count follower function: ', err)
        doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesRemoveCount.promise
  }

  getUserdetails (userId) {
    __logger.info('dbData: getUserdetails(): ', userId)
    const doesRemoveCount = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserdetails(), [userId, userId, 0])
      .then(result => {
        __logger.info('dbData: getUserdetails(): then 1:', result)
        if (result && result.length > 0) {
          doesRemoveCount.resolve(result)
        } else {
          doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in  get User details function: ', err)
        doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesRemoveCount.promise
  }

  insertUpdateCategory (userId, categoryId) {
    __logger.info('dbData: insertUpdateCategory(): ', userId)
    const doesRemoveCount = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.insertUpdateCategory(), [categoryId, userId, userId])
      .then(result => {
        __logger.info('dbData: insertUpdateCategory(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesRemoveCount.resolve(result)
        } else {
          doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in  insert Update Category function: ', err)
        doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesRemoveCount.promise
  }

  checkByCategoryId (categoryId) {
    __logger.info('dbData: checkByCategoryId(): ', categoryId)
    const doesRemoveCount = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, categoryQueryProvider.getCategoryByCategoryId(), [categoryId])
      .then(result => {
        __logger.info('dbData: checkByCategoryId(): then 1:', result)
        if (result && result.length > 0) {
          doesRemoveCount.resolve(result[0].categoryId)
        } else {
          doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_CATEGORY, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in  insert Update Category function: ', err)
        doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesRemoveCount.promise
  }

  updateCategoryCount (newCategoryId, oldCategoryId) {
    __logger.info('dbData: updateCategoryCount(): ', newCategoryId, oldCategoryId)
    const doesRemoveCount = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, categoryQueryProvider.updateFollowCount(oldCategoryId), [newCategoryId, oldCategoryId])
      .then(result => {
        __logger.info('dbData: updateCategoryCount(): then 1:', result)
        if (result && ((result[0] && result[0].affectedRows > 0 && result[1].affectedRows > 0) || result.affectedRows > 0)) {
          doesRemoveCount.resolve(result)
        } else {
          doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in  update Category Count function: ', err)
        doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesRemoveCount.promise
  }
}

module.exports = MappedData
