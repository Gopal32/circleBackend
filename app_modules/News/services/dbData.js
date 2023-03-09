const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const __constants = require('../../../config/constants')
const ValidatonService = require('./validation')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const __logger = require('../../../lib/logger')

class Category {
  constructor () {
    this.validate = new ValidatonService()
    this.uniqueId = new UniqueId()
  }

  checkNewsByAll (newsDetails, userId) {
    __logger.info('dbData: checkNewsByAll(): ')
    const doesCheckNewsByAll = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.checkNewsByAll(), [newsDetails.newsTitle, newsDetails.newsDescription, newsDetails.newsUrl, userId, newsDetails.categoryId])
      .then(result => {
        __logger.info('dbData: checkNewsByAll(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckNewsByAll.reject({ type: __constants.RESPONSE_MESSAGES.NEWS_EXISTS, data: {} })
        } else {
          doesCheckNewsByAll.resolve(false)
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check news by all function: ', err)
        doesCheckNewsByAll.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckNewsByAll.promise
  }

  checkUserNewsById (newsId, userId) {
    __logger.info('dbData: checkUserNewsById(): ')
    const doesCheckUserNewsById = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.checkUserNewsById(), [newsId, userId])
      .then(result => {
        __logger.info('dbData: checkUserNewsById(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckUserNewsById.resolve(result[0])
        } else {
          doesCheckUserNewsById.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_NEWS, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check user news by id function: ', err)
        doesCheckUserNewsById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckUserNewsById.promise
  }

  updateNews (newsDetatils, userId) {
    __logger.info('dbData: updateNews(): ')
    const doesupdateNews = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.updateNews(), [newsDetatils.newsTitle, newsDetatils.newsDescription, newsDetatils.newsUrl, newsDetatils.categoryId, userId, newsDetatils.newsId, userId])
      .then(result => {
        __logger.info('dbData: updateNews(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesupdateNews.resolve(userId)
        } else {
          doesupdateNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in update news by id function: ', err)
        doesupdateNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesupdateNews.promise
  }

  insertNews (newsDetatils, userId) {
    __logger.info('dbData: updateNews(): ')
    const doesInsertNews = q.defer()
    const newsId = this.uniqueId.uuid()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.insertNews(), [newsId, newsDetatils.newsTitle, newsDetatils.newsDescription, newsDetatils.newsUrl, newsDetatils.categoryId, userId, newsDetatils.categoryId])
      .then(result => {
        __logger.info('dbData: updateNews(): then 1:', result)
        if (result && result[0].affectedRows > 0 && result[1].affectedRows > 0) {
          doesInsertNews.resolve(userId)
        } else {
          doesInsertNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in insert news function: ', err)
        doesInsertNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesInsertNews.promise
  }

  checkUsersNews (userId) {
    __logger.info('dbData: checkUsersNews(): ')
    const doesCheckUsersNews = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.checkUsersNewsById(), [userId])
      .then(result => {
        __logger.info('dbData: checkUsersNews(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckUsersNews.resolve(result)
        } else {
          doesCheckUsersNews.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check user news function: ', err)
        doesCheckUsersNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckUsersNews.promise
  }

  checkNewsById (newsId) {
    __logger.info('dbData: checkNewsById(): ')
    const doesCheckNewsById = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.checkNewsById(), [newsId])
      .then(result => {
        __logger.info('dbData: checkNewsById(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckNewsById.resolve(result[0])
        } else {
          doesCheckNewsById.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_NEWS, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check news by id function: ', err)
        doesCheckNewsById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckNewsById.promise
  }

  checkSuggestNews (categoryId) {
    __logger.info('dbData: checkSuggestNews(): ', categoryId)
    const doesCheckSuggestNews = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.checkSuggestNews(), [categoryId])
      .then(result => {
        __logger.info('dbData: checkSuggestNews(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckSuggestNews.resolve(result)
        } else {
          doesCheckSuggestNews.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_NEWS, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check news by id function: ', err)
        doesCheckSuggestNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckSuggestNews.promise
  }

  deleteNewsByID (newsId, userId, categoryId) {
    __logger.info('dbData: deleteNewsByID(): ')
    const doesDeleteNewsByID = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.deleteNewsByID(), [false, newsId, userId, categoryId])
      .then(result => {
        __logger.info('dbData: deleteNewsByID(): then 1:', result)
        if (result && result[0].affectedRows > 0 && result[1].affectedRows > 0) {
          doesDeleteNewsByID.resolve(result[0])
        } else {
          doesDeleteNewsByID.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_NEWS, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check news by id function: ', err)
        doesDeleteNewsByID.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesDeleteNewsByID.promise
  }
}

module.exports = Category
