const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const __constants = require('../../../config/constants')
const ValidatonService = require('./validation')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const passMgmt = require('../../../lib/util/password_mgmt')
const __logger = require('../../../lib/logger')
const uniqueGenerator = require('../../../lib/util/uniqueUsername')

class UserData {
  constructor () {
    this.validate = new ValidatonService()
    this.uniqueId = new UniqueId()
  }

  getUserDataByEmailOrUsername (emailAndUsername) {
    __logger.info('dbData: getUserDataByEmailOrUsername(): ', emailAndUsername)
    const userDetails = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserDataByEmailOrUsername(), [emailAndUsername, emailAndUsername])
      .then(result => {
        __logger.info('dbData: getUserDataByEmailOrUsername(): then 1:', result)
        userDetails.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in get user function: ', err)
        userDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return userDetails.promise
  }

  getUserDataByEmail (email, forgetKey = null) {
    __logger.info('dbData: getUserDataByEmail(): ', email)
    const userDetails = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserDataByEmail(forgetKey), [email])
      .then(result => {
        __logger.info('dbData: getUserDataByEmail(): then 1:', result)
        userDetails.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in get user function: ', err)
        userDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return userDetails.promise
  }

  getUserDataByUserId (userId, flag = false) {
    __logger.info('dbData: getUserDataByUserId(): ', userId)
    const userDetails = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserDetailsByUserId(flag), [userId])
      .then(result => {
        __logger.info('dbData: getUserDataByUserId(): then 1:', result)
        userDetails.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in get user function: ', err)
        userDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return userDetails.promise
  }

  createUser (email, signupType) {
    __logger.info('dbData: createUser():', email)
    const userCreated = q.defer()
    let userId
    this.getUserDataByEmail(email)
      .then(exists => {
        __logger.info('dbData: createUser(): exists: then 2:', exists)
        if (exists && exists.length === 0) {
          userId = this.uniqueId.uuid()
          return __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.createUser(), [email, userId, userId, signupType])
        } else if (!exists?.[0]?.isProfileCompleted) {
          return exists
        } else {
          userCreated.reject({ type: __constants.RESPONSE_MESSAGES.USER_EXIST, data: {} })
        }
      })
      .then(result => {
        __logger.info('dbData: createUser(): exists: then 3:', result)
        if (result && result.affectedRows && result.affectedRows > 0) {
          userCreated.resolve({ userId })
        } else if (!result?.[0]?.isVerified) {
          userCreated.resolve({ userId: result[0].userId })
        } else if (result?.[0]?.isVerified) {
          userCreated.reject({ type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { userId: result[0].userId, isVerified: result[0].isVerified } })
        } else {
          userCreated.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: createUser(): catch:', err)
        userCreated.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return userCreated.promise
  }

  checkUserDetails (userName) {
    __logger.info('dbData: getUserDetails(): ')
    const userDetails = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserDetailsByUsername(), [userName])
      .then(result => {
        __logger.info('dbData: getUserDetails(): then 1:', result)
        if (result && result.length > 0) {
          userDetails.reject({ type: __constants.RESPONSE_MESSAGES.USER_EXIST, data: {}, err: '' })
        } else {
          userDetails.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('getUserDetails :: dbData: error in get user function: ', err)
        userDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return userDetails.promise
  }

  setUserdetails (userId, userName, fullName, planId) {
    __logger.info('dbData: setUserdetails(): ')
    const userDetailId = this.uniqueId.uuid()
    const userDetail = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.setUserdetails(), [userDetailId, userName, fullName, planId, userId])
      .then(result => {
        __logger.info('dbData: setUserdetails(): then 1:', result)
        userDetail.resolve(result)
      })
      .catch(err => {
        __logger.error('setUserdetails :: dbData: error in insert user details function: ', err)
        userDetail.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return userDetail.promise
  }

  setPassword (userId, password) {
    __logger.info('dbData: setPassword(): ')
    const passwordSalt = passMgmt.genRandomString(16)
    const hashPassword = passMgmt.create_hash_of_password(password, passwordSalt).passwordHash
    const userPwd = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.setUserPwd(), [hashPassword, passwordSalt, userId, userId])
      .then(result => {
        __logger.info('dbData: setPassword(): then 1:', result)
        if (result && result.affectedRows === 1) {
          userPwd.resolve(result)
        } else {
          userPwd.reject({ type: __constants.RESPONSE_MESSAGES.USER_ID_NOT_EXIST, data: {} })
        }
      })
      .catch(err => {
        __logger.error('setPassword :: dbData: error in insert password function: ', err)
        userPwd.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return userPwd.promise
  }

  checkEmailExist (email) {
    __logger.info('addVerificationCode:')
    const emailExistsOrNot = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserDetailsByEmail(), [email])
      .then(result => {
        __logger.info('dbData: setPassword(): then 1:', result)
        if (result && result.length > 0) {
          emailExistsOrNot.reject({ type: __constants.RESPONSE_MESSAGES.USER_EXIST, data: {} })
        } else {
          emailExistsOrNot.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('setPassword :: dbData: error in update user function: ', err)
        emailExistsOrNot.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return emailExistsOrNot.promise
  }

  checkUsernameExist (userName) {
    __logger.info('checkUsernameExist:')
    const usernameExistsOrNot = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserDetailsByUsername(), [userName])
      .then(result => {
        __logger.info('dbData: checkUsernameExist(): then 1:', result)
        if (result && result.length > 0) {
          usernameExistsOrNot.reject({ type: __constants.RESPONSE_MESSAGES.USER_EXIST, data: {} })
        } else {
          usernameExistsOrNot.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('checkUsernameExist :: dbData: error in check Username Exist function: ', err)
        usernameExistsOrNot.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return usernameExistsOrNot.promise
  }

  setPhotoUrl (userId, url) {
    __logger.info('setPhotoUrl:')
    const photoUrl = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.updatePhotoUrl(), [url, userId, userId])
      .then(result => {
        __logger.info('dbData: setPhotoUrl(): then 1:', result)
        if (result && result.affectedRows === 1) {
          photoUrl.resolve(result)
        } else {
          photoUrl.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('setPhotoUrl :: dbData: error in Update photo function: ', err)
        photoUrl.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return photoUrl.promise
  }

  updateotpVerifed (userId) {
    __logger.info('updateotpVerifed:')
    const otpVerified = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.updateotpVerifed(), [false, userId, userId])
      .then(result => {
        __logger.info('dbData: updateotpVerifed(): then 1:', result)
        if (result && result.affectedRows === 1) {
          otpVerified.resolve(result)
        } else {
          otpVerified.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('updateotpVerifed :: dbData: error in Update otp verified function: ', err)
        otpVerified.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return otpVerified.promise
  }

  updatePwd (userId, newPwd, saltKey) {
    __logger.info('updatePwd:')
    const otpVerified = q.defer()
    const hashPassword = passMgmt.create_hash_of_password(newPwd, saltKey).passwordHash
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.updatePwd(), [hashPassword, userId, userId])
      .then(result => {
        __logger.info('dbData: updatePwd(): then 1:', result)
        if (result && result.affectedRows === 1) {
          otpVerified.resolve(result)
        } else {
          otpVerified.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, data: {} })
        }
      })
      .catch(err => {
        __logger.error('updatePwd :: dbData: error in Update photo function: ', err)
        otpVerified.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return otpVerified.promise
  }

  generateUsername (userName, email, count) {
    __logger.info('generateUsername:', userName, email, count)
    const doesGenerateUsername = q.defer()
    let setEmail
    if (count <= 2) {
      setEmail = email
    } else if (count > 3) {
      let result = ''
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
      }
      setEmail = result
    } else {
      setEmail = userName
    }
    const result = uniqueGenerator(setEmail)
    this.checkUsername(result, email, count)
      .then(result => {
        doesGenerateUsername.resolve(result)
      })
      .catch(err => {
        __logger.error('generateUsername :: dbData: error in generate Username function: ', err)
        doesGenerateUsername.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGenerateUsername.promise
  }

  checkUsername (userName, email, count = 0) {
    __logger.info('checkUsername:')
    const doesCheckUsername = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserDetailsByUsername(), [userName])
      .then(result => {
        __logger.info('dbData: checkUsername(): then 1:', result)
        if (result && result.length > 0) {
          count += 1
          this.generateUsername(userName, email, count)
        } else {
          doesCheckUsername.resolve(userName)
        }
      })
      .catch(err => {
        __logger.error('checkUsername :: dbData: error in check Username Exist function: ', err)
        doesCheckUsername.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckUsername.promise
  }

  getUserDetails (userId) {
    __logger.info('getUserDetails:')
    const doesGetUserDetails = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.userDetails(), [userId])
      .then(result => {
        __logger.info('dbData: getUserDetails(): then 1:', result)
        if (result && result.length > 0) {
          doesGetUserDetails.resolve(result[0])
        } else {
          doesGetUserDetails.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, data: {} })
        }
      })
      .catch(err => {
        __logger.error('getUserDetails :: dbData: error in get user details function: ', err)
        doesGetUserDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetUserDetails.promise
  }

  romoveRedisUserdetials (userId) {
    __logger.info('romoveRedisUserdetials:', userId)
    const doesGetUserDetails = q.defer()
    __db.redis.key_delete(`${__constants.REDIS_KEY.USER_DETAILS}${userId}`)
      .then(result => {
        doesGetUserDetails.resolve(result)
      })
      .catch(err => {
        __logger.error('getUserDetails :: dbData: error in romove Redis Key User detials function: ', err)
        doesGetUserDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetUserDetails.promise
  }

  updatePlan (userId, planId) {
    __logger.info('updatePlan:', userId)
    const doesGetUserDetails = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.updatePlan(), [planId, userId, userId])
      .then(result => {
        if (result && result.affectedRows === 1) {
          doesGetUserDetails.resolve(planId)
        } else {
          doesGetUserDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('updatePlan :: dbData: error in update Plan in User detials function: ', err)
        doesGetUserDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetUserDetails.promise
  }
}
module.exports = UserData
