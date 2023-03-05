const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __config = require('../../../config')
const __logger = require('../../../lib/logger')
const upload = require('../../../lib/uploads/index').uploadImage
const fs = require('fs')
const UserService = require('../services/dbData')

const updateProfilePic = (req, res) => {
  __logger.info('inside updateProfilePic :: ')
  const userId = req.user && req.user.userId ? req.user.userId : 0
  const url = __config.photoUrl + `${userId}.png`
  const userService = new UserService()
  upload(req, res, function (err, data) {
    if (err) {
      if (err.code === __constants.CUSTOM_CONSTANT.UPLOAD_ERROR_MSG.LIMIT_FILE_SIZE) {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.INVALID_FILE_SIZE, err: { maxFileSizeInBytes: __constants.FILE_MAX_UPLOAD_IN_BYTE }, data: {} })
      } else {
        return res.send(err)
      }
    }
    if (!req.files || (req.files && !req.files[0])) {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.PROVIDE_FILE, data: {} })
    } else {
      fs.writeFileSync(url, req.files[0].buffer)
      userService.setPhotoUrl(userId, url)
        .then(results => {
          return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: {} })
        })
        .catch(err => {
          __logger.error('error: updateProfilePic function ', err)
          return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || {} })
        })
    }
  })
}

module.exports = updateProfilePic
