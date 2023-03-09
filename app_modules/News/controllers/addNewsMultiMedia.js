const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const __config = require('../../../config')
const fs = require('fs')
const upload = require('../../../lib/uploads').uploadNews
const generateId = require('../../../lib/util/password_mgmt').genRandomString
const PlanService = require('../../plan/services/dbData')

const addNewsMultiMedia = (req, res) => {
  __logger.info('inside addNewsMultiMedia :: ')
  const userId = req.user && req.user.userId ? req.user.userId : 0
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const arrOfFileUpload = []
  const planService = new PlanService()

  planService.checkPlan(planId)
    .then((data) => {
      __logger.info('addNewsMultiMedia :: Then 1')
      if (data && data.addNews) {
        upload(req, res, function (err, data) {
          if (err) {
            if (err.code === __constants.CUSTOM_CONSTANT.UPLOAD_ERROR_MSG.LIMIT_FILE_SIZE) {
              return __util.send(res, { type: __constants.RESPONSE_MESSAGES.INVALID_FILE_SIZE, err: { maxFileSizeInBytes: __constants.FILE_MAX_UPLOAD_IN_BYTE }, data: {} })
            } else {
              return res.send(err)
            }
          }
          if (!req.files || (req.files && req.files.length <= 0)) {
            return __util.send(res, { type: __constants.RESPONSE_MESSAGES.PROVIDE_FILE, data: {} })
          } else {
            if (!fs.existsSync(__config.newsUrl + `${userId}`)) fs.mkdirSync(__config.newsUrl + `${userId}`)
            for (const fileUpload of req.files) {
              const extension = fileUpload.originalname.split('.').length > 0 ? fileUpload.originalname.split('.')[fileUpload.originalname.split('.').length - 1] : ''
              const url = __config.newsUrl + `${userId}/${generateId(10)}.${extension}`
              fs.writeFileSync(url, fileUpload.buffer)
              arrOfFileUpload.push(url)
            }
            return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: arrOfFileUpload })
          }
        })
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, data: {} })
      }
    })
}

module.exports = addNewsMultiMedia
