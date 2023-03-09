const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const Validation = require('../services/validation')
const Service = require('../services/dbData')
const UserService = require('../../user/services/dbData')

const addUpdateCategory = (req, res) => {
  __logger.info('Inside addUpdateCategory')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const oldCategoryId = req.userConfig && req.userConfig.categoryId ? req.userConfig.categoryId[0].split(',') : ['']
  let newCategoryId
  const validation = new Validation()
  const service = new Service()
  const userService = new UserService()
  validation.checkCategoryId(req.body)
    .then(data => {
      return service.checkByCategoryId(req.body.categoryId)
    })
    .then(data => {
      newCategoryId = data.split(',')
      return service.insertUpdateCategory(userId, data)
    })
    .then(data => {
      return service.updateCategoryCount(newCategoryId, oldCategoryId)
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

module.exports = addUpdateCategory
