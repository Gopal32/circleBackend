const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const Service = require('../services/dbData')

const addCategoryForAdmin = (req, res) => {
  __logger.info('Inside addCategoryForAdmin')
  const validate = new ValidationService()
  const userService = new Service()
  const uniqueId = new UniqueId()
  const categoryId = uniqueId.uuid()
  validate.updateCategory(req.body)
    .then(data => {
      if (req.body.categoryId) {
        return userService.checkByCategoryId(req.body.categoryName, req.body.categoryId)
      } else {
        return userService.checkByCategoryName(req.body.categoryName)
      }
    })
    .then(data => {
      __logger.info('addCategory :: then 1')
      if (req.body.categoryId) {
        return userService.updateCategory(req.body.categoryId, req.body)
      } else {
        return userService.insertCategory(categoryId, req.body)
      }
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { } })
    })
    .catch(err => {
      __logger.error('error: addCategoryForAdmin function ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = addCategoryForAdmin
