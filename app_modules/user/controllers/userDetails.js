// const q = require('q')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __config = require('../../../config')
const __logger = require('../../../lib/logger')
const multer = require('multer')
// const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const fs = require('fs')
// const rejectionHandler = require('../../../lib/util/rejectionHandler')
// Services
const UserService = require('../services/dbData')
// const ValidatonService = require('../services/validation')
// const BusinessAccountService = require('../../whatsapp_business/services/businesAccount')

/**
 * @namespace -Authorize-Controller-
 * @description API's related to authorization, creation of auth token etc are placed here.
 */

// const createAuthTokenByUserId = userId => {
//   __logger.info('createAuthTokenByUserId')
//   const authToken = q.defer()
//   // const businessAccountService = new BusinessAccountService()
//   if (!userId || typeof userId !== 'string') {
//     authToken.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Please provide userId of type string' })
//     return authToken.promise
//   }
//   businessAccountService.checkUserIdExist(userId)
//     .then(businessData => {
//       if (businessData.exists && businessData.record && businessData.record.phoneCode && businessData.record.phoneNumber) {
//         const payload = {
//           user_id: userId,
//           wabaPhoneNumber: businessData.record.phoneCode.split('+').join('') + businessData.record.phoneNumber,
//           signature: new UniqueId().uuid(),
//           maxTpsToProvider: businessData.record.maxTpsToProvider
//         }
//         const token = authMiddleware.setToken(payload, __constants.CUSTOM_CONSTANT.AUTH_TOKEN_30_MINS)
//         return authToken.resolve(token)
//       } else {
//         return rejectionHandler({ type: __constants.RESPONSE_MESSAGES.WABA_ID_NOT_EXISTS, err: {}, data: {} })
//       }
//     })
//     .catch(err => {
//       __logger.error('authToken error: ', err)
//       authToken.reject({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || err })
//     })
//   return authToken.promise
// }

/**
 * @memberof -Authorize-Controller-
 * @name Authorize
 * @path {POST} /users/authorize
 * @description Bussiness Logic :- In Authorize API, use API key and generate auth token to be used in other supported API’s.
Token generated using this API have validity of 30 days.
 * @auth {string} Authorization - User needs to enter base64 encoded email and password, Email & Password needs to be encoded in the following manner : 'email:password’, format for header value : "Bearer[SPACE]base64EncodedTextOfEmailAndPassword", example for header value : "Bearer MTIxQGdtYWlsLmFiY2Q="
  <br/><br/><b>API Documentation : </b> {@link https://stage-whatsapp.helo.ai/helowhatsapp/api/internal-docs/7ae9f9a2674c42329142b63ee20fd865/#/users/authorize|Authorize}
 * @body {string}  apiKey=hsdbhsvbsvbs-cbdahcbvdavcd-pojcbnjbc-cshcdvyaya -  Provide the valid API key for authorization purpose
 * @response {string} ContentType=application/json - Response content type.
 * @response {string} metadata.msg=Success  - Response got successfully.
 * @response {string} metadata.data.apiToken - It will return the token that will be used in other supported API for Helo whatsapp.
 * @code {200} if the msg is success Returns auth token if API key provided is correctly.
 * @author Danish Galiyara 30 July, 2020
 * *** Last-Updated :- Arjun Bhole 23 October,2020 ***
 */

const filter = function (req, file, cb) {
  __logger.info('filter')
  var filetypes = /(jpe?g|png)$/i
  let fileExt = file.originalname.split('.')
  fileExt = fileExt[fileExt.length - 1]
  var extname = filetypes.test(fileExt.toLowerCase())
  __logger.info('file mime type filter  -->', extname, fileExt)
  if (extname) {
    return cb(null, true)
  } else {
    const err = { ...__constants.RESPONSE_MESSAGES.INVALID_FILE_TYPE, err: 'File upload only supports the following filetypes - jpg, jpeg, png' }
    cb(err)
  }
}

const upload = multer({
  fileFilter: filter,
  limits: { fileSize: __constants.FILE_MAX_UPLOAD_IN_BYTE }
}).array('profilePic', 1)

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
          __logger.error('error: ', err)
          return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || {} })
        })
    }
  })
}

module.exports = { updateProfilePic }
