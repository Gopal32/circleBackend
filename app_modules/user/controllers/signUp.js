const ValidatonService = require('../services/validation')
const VerificationService = require('../services/verification')
const __util = require('../../../lib/util')
const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const UserService = require('../services/dbData')
const authMiddleware = require('../../../middlewares/auth/authentication')
// const addTempTfaDataBS = require('../controllers/verification').addTempTfaDataBS
const emailValidator = require('deep-email-validator')

/**
 * @namespace -SignUp-Controller-
 * @description SignUp API and SignUp function.
 */

/**
 * @memberof -SignUp-Controller-
 * @name SignUp
 * @path {POST} /users/signUp
 * @description Bussiness Logic :- sign up / create account (API to sign up / create account with viva connect helo-whatsapp)
 <br/><br/><b>API Documentation : </b> {@link https://stage-whatsapp.helo.ai/helowhatsapp/api/internal-docs/7ae9f9a2674c42329142b63ee20fd865/#/users/signUp|SignUp}
 * @body {string}  email - Provide the valid email for login.
 * @body {string}  password - Provide the correct password for login.
 * @body {boolean}  tncAccepted=true - Read terms and condition
 * @response {string} ContentType=application/json - Response content type.
 * @response {string} metadata.msg=Success  - Response got successfully.
 * @response {string} metadata.data.userId - Is the user is created, it will return userId in string.
 * @code {200} if the msg is success, Returns userId if user is created or if the user exist in database than it will return as User Already Exists.
 * @author Arjun Bhole 11th May, 2020
 * *** Last-Updated :- Arjun Bhole 23 October,2020 ***
 */

const controllerSignUp = (req, res) => {
  __logger.info('Inside Sign up')
  const verificationService = new VerificationService()
  const userService = new UserService()
  let userId
  if (!req.body.email || req.body.email === '0') {
    return __util.send(res, { type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, data: {}, err: ['please provide email ID of type string'] })
  }
  emailValidator.validate(req.body.email)
    .then(data => {
      __logger.info('controllerSignUp :: signUp function', data)
      // if (data && data.valid && data.validators && data.validators.mx && data.validators.mx.valid && data.validators.smtp && data.validators.smtp.valid) {
      return userService.createUser(req.body.email, __constants.PROVIDER_TYPE.email)
      // } else {
      //   return __util.send(res, { type: __constants.RESPONSE_MESSAGES.EMAIL_NOT_VALID, data: {}, err: [] })
      // }
    })
    .then(data => {
      userId = data.userId
      return verificationService.addVerificationCode(userId, __constants.VERIFICATION_CHANNEL.email.expiresIn, __constants.VERIFICATION_CHANNEL.email.codeLength)
    })
    .then(data => { return verificationService.sendVerificationCodeByEmail(data.code, req.body.email) })
    .then(data => {
      __logger.info('controllerSignUp :: signUp function :: Then 1', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.EMAIL_VC, data: { userId } })
    })
    .catch(err => {
      __logger.error('controllerSignUp :: signUp function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: err.data, err: err.err })
    })
}

const resendOtp = (req, res) => {
  __logger.info('Inside resend OTP')
  const validate = new ValidatonService()
  const verificationService = new VerificationService()
  const userService = new UserService()
  let userDetails 
  validate.checkUserId(req.body)
    .then(data => {
      __logger.info('resendOtp function', data)
      return userService.getUserDataByEmailAndUserId(req.body.userId)
    })
    .then(data => {
      userDetails = data[0]
      if (data && data.length > 0) {
        return verificationService.addVerificationCode(userDetails.userId, __constants.VERIFICATION_CHANNEL.email.expiresIn, __constants.VERIFICATION_CHANNEL.email.codeLength)
      } else {
        __util.send(res, { type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST })
      }
    })
    .then(data => { return verificationService.sendVerificationCodeByEmail(data.code, userDetails.email) })
    .then(data => {
      __logger.info('resendOtp function :: Then 1', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.EMAIL_VC, data: { userId: userDetails.userId } })
    })
    .catch(err => {
      __logger.error('resendOtp function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

const setUsername = (req, res) => {
  __logger.info('Inside setUsername')
  const validate = new ValidatonService()
  const userService = new UserService()
  const subscriptionId = 'free_plan'
  validate.setUser(req.body)
    .then(data => {
      __logger.info('setUsername function', data)
      return userService.checkUserDetails(req.body.userName)
    })
    .then(data => { return userService.setPassword(req.body.userId, req.body.password) })
    .then(data => { return userService.setUserdetails(req.body.userId, req.body.userName, req.body.fullName, __constants.SUBSCRIPTION[subscriptionId]) })
    .then(data => {
      __logger.info('setUsername function :: Then 1', { data })
      const payload = { userId: req.body.userId, signupType: req.body.signupType, subscriptionId: __constants.SUBSCRIPTION[subscriptionId] }
      const token = authMiddleware.setToken(payload, __constants.CUSTOM_CONSTANT.SESSION_TIME)
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { token: token } })
    })
    .catch(err => {
      __logger.error('setUsername function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

const emailVerify = (req, res) => {
  __logger.info('Inside emailVerify')
  const userService = new UserService()
  emailValidator.validate(req.query.email)
    .then(data => {
      __logger.info('emailVerify function', data)
      if (data && data.valid && data.validators && data.validators.mx && data.validators.mx.valid && data.validators.smtp && data.validators.smtp.valid) {
        return userService.checkEmailExist(req.query.email)
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.EMAIL_NOT_VALID, data: {} })
      }
    })
    .then(data => {
      __logger.info('emailVerify function :: Then 1', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: {} })
    })
    .catch(err => {
      __logger.error('emailVerify function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

const usernameVerify = (req, res) => {
  __logger.info('Inside usernameVerify')
  const validate = new ValidatonService()
  const userService = new UserService()
  validate.checkUserName(req.query)
    .then(data => {
      __logger.info('usernameVerify function', data)
      return userService.checkUsernameExist(req.query.userName)
    })
    .then(data => {
      __logger.info('usernameVerify function :: Then 1', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: {} })
    })
    .catch(err => {
      __logger.error('usernameVerify function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

const forgetPwd = (req, res) => {
  __logger.info('Inside forgetPwd')
  const userService = new UserService()
  const verificationService = new VerificationService()
  let userId
  emailValidator.validate(req.body.email)
    .then(data => {
      __logger.info('forgetPwd function', data)
      if (data && data.valid && data.validators && data.validators.mx && data.validators.mx.valid && data.validators.smtp && data.validators.smtp.valid) {
        return userService.getUserDataByEmailAndUserId(req.body.email)
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.EMAIL_NOT_VALID, data: {} })
      }
    })
    .then(data => {
      if (data && data.length > 0) {
        return verificationService.addVerificationCode(data[0].userId, __constants.VERIFICATION_CHANNEL.email.expiresIn, __constants.VERIFICATION_CHANNEL.email.codeLength)
      } else {
        __util.send(res, { type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST })
      }
    })
    .then(data => {
      if (data) {
        userId = data.userId
        return verificationService.sendVerificationCodeByEmail(data.code, req.body.email)
      }
    })
    .then(data => {
      __logger.info('forgetPwd function :: Then 1', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.EMAIL_VC, data: { userId } })
    })
    .catch(err => {
      __logger.error('forgetPwd function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}
module.exports = { controllerSignUp, resendOtp, setUsername, emailVerify, usernameVerify, forgetPwd }
