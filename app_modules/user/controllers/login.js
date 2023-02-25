const ValidatonService = require('../services/validation')
const __util = require('../../../lib/util')
const passMgmt = require('../../../lib/util/password_mgmt')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const authMiddleware = require('../../../middlewares/auth/authentication')
const UserService = require('../services/dbData')

/**
 * @namespace -Login-Controller-
 * @description Login API and login function.
 */

/**
 * @memberof -Login-Controller-
 * @name Login
 * @path {POST} /users/auth/login
 * @description Bussiness Logic :- Login API for logging in and using another API’s
    <br/><br/><b>API Documentation : </b> {@link https://stage-whatsapp.helo.ai/helowhatsapp/api/internal-docs/7ae9f9a2674c42329142b63ee20fd865/#/users/auth/login|Login}
 * @body {string}  email - Provide the valid email for login.
 * @body {string}  password - Provide the correct password for login.
 * @response {string} ContentType=application/json - Response content type.
 * @response {string} metadata.msg=Success  - Response got successfully.
 * @response {string} metadata.data.token - It will return the token that will be used in other supported API for Helo whatsapp.
 * @code {200} if the msg is success, Returns auth token if credentials provided are correct.
 * @author Arjun Bhole 11th May, 2020
 * *** Last-Updated :- Arjun Bhole 23 October,2020 ***
 */

const controller = (req, res) => {
  __logger.info('Inside login')
  const validate = new ValidatonService()
  const userService = new UserService()
  validate.login(req.body)
    .then(data => {
      __logger.info('Login :: controller :: Then 1', { data })
      return userService.getUserDataByEmailOrUsername(req.body.emailAndUsername)
    })
    .then(data => {
      if (data && data.length > 0) {
        __logger.info('Login :: controller:: Then 2', { data })
        const hashPassword = passMgmt.create_hash_of_password(req.body.password, data[0].saltKey.toLowerCase())
        if (hashPassword.passwordHash !== data[0].hashPassword.toLowerCase()) { // todo : use bcrypt
          return __util.send(res, { type: __constants.RESPONSE_MESSAGES.NOT_AUTHORIZED, data: null })
        }
        const payload = { userId: data[0].userId, signupType: data[0].signupType }
        const token = authMiddleware.setToken(payload, __constants.CUSTOM_CONSTANT.SESSION_TIME)
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { userId: data[0].userId, token: token } })
      } else {
        __util.send(res, { type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST })
      }
    })
    .catch(err => {
      __logger.error('error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = controller
