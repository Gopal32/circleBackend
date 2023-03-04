const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const UserService = require('../services/dbData')
const ValidationService = require('../services/validation')
const rejectionHandler = require('../../../lib/util/rejectionHandler')

/**
 * @memberof -Password-Management-Controller-
 * @name ChangePassword
 * @path {POST} /users/auth/changepassword
 * @description Bussiness Logic :- This API is used to reset the password.
 <br/><br/><b>API Documentation : </b> {@link https://stage-whatsapp.helo.ai/helowhatsapp/api/internal-docs/7ae9f9a2674c42329142b63ee20fd865/#/users/changePassword|ChangePassword}
 * @body {string}  newPassword=habc67 - Please provide the new password.
 * @body {string}  token=asdasdasdsadm - Please provide the valid token.
 * @response {string} ContentType=application/json - Response content type.
 * @response {string} metadata.msg - It will return Success if the password reset successfully or it will give error msg as Invalid token  if the token is not valid.
 * @author Danish Galiyara 2nd September, 2020
 * *** Last-Updated :- Danish Galiyara 2nd September, 2020 ***
 */

const changePassword = (req, res) => {
  const userService = new UserService()
  const validate = new ValidationService()
  __logger.info('Inside change password called: ', req.body)
  validate.changePassword(req.body)
    .then(data => {
      __logger.info('changePassword function', data)
      return userService.getUserDataByUserId(req.body.userId, true)
    })
    .then(data => {
      if (data && data.length > 0) {
        return userService.updatePwd(req.body.userId, req.body.newPassword, data[0].saltKey)
      } else {
        return rejectionHandler({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, err: {} })
      }
    })
    .then(data => __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: {} }))
    .catch(err => {
      __logger.error('error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || {} })
    })
}

// const resetPasssword = (req, res) => {
//   __logger.info('resetPassword function called::', req.body)
//   const userId = req.user && req.user.user_id ? req.user.user_id : '0'
//   const userService = new UserService()
//   const validate = new ValidatonService()
//   validate.resetPassword(req.body)
//     .then(data => userService.updatePwd(req.body.userId, req.body.newPassword))
//     .then(result => {
//       __logger.info('result from db---', result)
//       const hashPassword = passMgmt.create_hash_of_password(req.body.oldPassword, result.saltKey.toLowerCase())
//       __logger.info('hash of oldPassword::', hashPassword)
//       if (hashPassword.passwordHash !== result.hashPass.toLowerCase()) { // todo : use bcrypt
//         return rejectionHandler({ type: __constants.RESPONSE_MESSAGES.NOT_AUTHORIZED, data: {} })
//       }
//       return userService.updatePassword(userId, req.body.newPassword)
//     })
//     .then(data => {
//       __logger.info('updated password for userId::', data)
//       return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: {} })
//     })
//     .catch(err => {
//       __logger.error('error: ', err)
//       return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || {} })
//     })
// }

module.exports = changePassword
