const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const __constants = require('../../../config/constants')
const ValidatonService = require('./validation')
// const rejectionHandler = require('../../../lib/util/rejectionHandler')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
// const passMgmt = require('../../../lib/util/password_mgmt')
const __logger = require('../../../lib/logger')
// const _ = require('lodash')
// const AgreementStatusEngine = require('../services/status')

class Category {
  constructor () {
    this.validate = new ValidatonService()
    this.uniqueId = new UniqueId()
  }

  checkByCategoryId (categoryName, categoryId) {
    __logger.info('dbData: checkByCategoryId(): ')
    const doesCheckByCategoryId = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.checkCategory(), [categoryId, categoryName])
      .then(result => {
        __logger.info('dbData: checkByCategoryId(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckByCategoryId.resolve(result)
        } else {
          doesCheckByCategoryId.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_CATEGORY, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check by category id exists function: ', err)
        doesCheckByCategoryId.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckByCategoryId.promise
  }

  checkByCategoryName (categoryName) {
    __logger.info('dbData: checkByCategoryId(): ')
    const doesCheckByCategoryName = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.checkCategory(), ['', categoryName])
      .then(result => {
        __logger.info('dbData: checkByCategoryId(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckByCategoryName.reject({ type: __constants.RESPONSE_MESSAGES.CATEGORY_EXISTS, data: {} })
        } else {
          doesCheckByCategoryName.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check by category id exists function: ', err)
        doesCheckByCategoryName.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckByCategoryName.promise
  }

  insertCategory (categoryId, categoryDetails) {
    __logger.info('dbData: insertCategory(): ')
    const doesInsertCategory = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.addCategory(), [categoryId, categoryDetails.categoryName, categoryDetails.categoryDescription, categoryDetails.userId])
      .then(result => {
        __logger.info('dbData: insertCategory(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesInsertCategory.resolve(result)
        } else {
          doesInsertCategory.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in insert category function: ', err)
        doesInsertCategory.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesInsertCategory.promise
  }

  updateCategory (categoryId, categoryDetails) {
    __logger.info('dbData: insertCategory(): ', categoryId, categoryDetails)
    const doesInsertCategory = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.updateCategory(), [categoryDetails.categoryDescription, categoryDetails.userId, categoryId])
      .then(result => {
        __logger.info('dbData: insertCategory(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesInsertCategory.resolve(result)
        } else {
          doesInsertCategory.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in insert category function: ', err)
        doesInsertCategory.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesInsertCategory.promise
  }
}

module.exports = Category
