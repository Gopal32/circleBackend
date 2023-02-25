const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const __constants = require('../../../config/constants')
const ValidatonService = require('./validation')
// const rejectionHandler = require('../../../lib/util/rejectionHandler')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const passMgmt = require('../../../lib/util/password_mgmt')
const __logger = require('../../../lib/logger')
// const _ = require('lodash')
// const AgreementStatusEngine = require('../services/status')

class UserData {
  constructor () {
    this.validate = new ValidatonService()
    this.uniqueId = new UniqueId()
  }

  getUserDataByEmail (email) {
    __logger.info('dbData: getUserDataByEmail(): ', email)
    const userDetails = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserDetailsByEmail(), [email])
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

  getUserDataByEmailAndUserId (email, userId = null) {
    __logger.info('dbData: getUserDataByEmailAndUserId(): ', email, userId)
    const userDetails = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserDetailsByEmail(userId), [email, userId])
      .then(result => {
        __logger.info('dbData: getUserDataByEmailAndUserId(): then 1:', result)
        userDetails.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in get user function: ', err)
        userDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return userDetails.promise
  }

  createUser (email) {
    __logger.info('dbData: createUser():', email)
    const userCreated = q.defer()
    let userId
    this.getUserDataByEmail(email)
      .then(exists => {
        __logger.info('dbData: createUser(): exists: then 2:', exists)
        if (exists && exists.length === 0) {
          userId = this.uniqueId.uuid()
          return __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.createUser(), [email, userId, userId, __constants.PROVIDER_TYPE.email])
        } else {
          userCreated.reject({ type: __constants.RESPONSE_MESSAGES.USER_EXIST, data: {} })
        }
      })
      .then(result => {
        __logger.info('dbData: createUser(): exists: then 3:', result)
        if (result && result.affectedRows && result.affectedRows > 0) {
          userCreated.resolve({ userId })
        } else {
          userCreated.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.info('dbData: createUser(): catch:', err)
        if (err.type) return userCreated.reject({ type: err.type, err: err.err })
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

  setUserdetails (userId, userName, fullName) {
    __logger.info('dbData: setUserdetails(): ')
    const userDetailId = this.uniqueId.uuid()
    const userDetail = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.setUserdetails(), [userDetailId, userName, fullName, userId])
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

  setPassword (userId, password, plan) {
    __logger.info('dbData: setPassword(): ')
    const passwordSalt = passMgmt.genRandomString(16)
    const hashPassword = passMgmt.create_hash_of_password(password, passwordSalt).passwordHash
    const userPwd = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.setUserPwd(), [hashPassword, passwordSalt, plan, userId, userId])
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
    const emailExistsOrNot = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserDetailsByUsername(), [userName])
      .then(result => {
        __logger.info('dbData: checkUsernameExist(): then 1:', result)
        if (result && result.length > 0) {
          emailExistsOrNot.reject({ type: __constants.RESPONSE_MESSAGES.USER_EXIST, data: {} })
        } else {
          emailExistsOrNot.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('checkUsernameExist :: dbData: error in check Username Exist function: ', err)
        emailExistsOrNot.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return emailExistsOrNot.promise
  }

  setPhotoUrl (userId, url) {
    __logger.info('setPhotoUrl:')
    const emailExistsOrNot = q.defer()
    __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.updatePhotoUrl(), [url, userId, userId])
      .then(result => {
        __logger.info('dbData: setPhotoUrl(): then 1:', result)
        if (result && result.affectedRows === 1) {
          emailExistsOrNot.resolve(result)
        } else {
          emailExistsOrNot.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('setPhotoUrl :: dbData: error in Update photo function: ', err)
        emailExistsOrNot.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return emailExistsOrNot.promise
  }
  // checkUserIdExistsForAccountProfile (userId) {
  //   __logger.info('dbData: Check UserId Exists For Account Profile: ', userId)
  //   // declare a prmoise
  //   const doesUserIdExist = q.defer()
  //   // checking using service whether the userId is  provided or not
  //   this.validate.checkUserIdService({ userId })
  //     // then using a query to check that a record exist or not in table
  //     .then(valResponse => {
  //       __logger.info('dbData: Response then 1:', { valResponse })
  //       return __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserAccountProfile(), [userId])
  //     })
  //     .then(result => {
  //       __logger.info('dbData: then 2', { result })
  //       // if exist throw return true exist
  //       if (result && result.length > 0) {
  //         doesUserIdExist.resolve({ rows: result, exists: true })
  //       } else {
  //         // else return prmoise to continue the insertiono of data
  //         doesUserIdExist.resolve({ exists: false })
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in check User Exist By UserId: ', err)
  //       doesUserIdExist.reject(false)
  //     })
  //   return doesUserIdExist.promise
  // }

  // checkUserIdExistForBusiness (userId) {
  //   __logger.info('dbData: checkUserIdExistForBusiness():', userId)
  //   // declare a prmoise
  //   const doesUserIdExist = q.defer()
  //   // checking using service whether the userId is  provided or not
  //   this.validate.checkUserIdService({ userId })
  //     // then using a query to check that a record exist or not in table
  //     .then(valResponse => {
  //       __logger.info('dbData: Response then 1', { valResponse })
  //       return __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getBillingProfileWithBusinessInfoId(), [userId])
  //     })
  //     .then(result => {
  //       __logger.info('dbData: result then 2', { result })
  //       // if exist throw return true exist
  //       if (result && result.length === 0) {
  //         doesUserIdExist.resolve({ record: {}, exists: false })
  //       } else {
  //         // else return prmoise to continue the insertiono of data
  //         doesUserIdExist.resolve({ record: result[0], exists: true })
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in checkUserExistByUserId function: ', err)
  //       doesUserIdExist.reject(false)
  //     })
  //   return doesUserIdExist.promise
  // }

  // checkIfApiKeyExists (apiKey, supportUser) {
  //   __logger.info('dbData: checkIfApiKeyExists():', supportUser)
  //   const userDetails = q.defer()
  //   let queries
  //   if (supportUser) {
  //     queries = queryProvider.getSupportUserId()
  //   } else {
  //     queries = queryProvider.getUserIdFromKey()
  //   }
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queries, [apiKey])
  //     .then(result => {
  //       __logger.info('dbData: result then 1:', { result })
  //       if (result && result.length === 0) {
  //         userDetails.reject({ type: __constants.RESPONSE_MESSAGES.NOT_AUTHORIZED, data: {} })
  //       } else {
  //         userDetails.resolve(result[0])
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in get user function: ', err)
  //       userDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
  //     })
  //   return userDetails.promise
  // }

  // getPasswordTokenByEmail (email) {
  //   __logger.info('dbData: getPasswordTokenByEmail():')
  //   const passwordTokenData = q.defer()
  //   if (!email || typeof email !== 'string') {
  //     passwordTokenData.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Please provide email id of type string' })
  //     return passwordTokenData.promise
  //   }
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getPasswordTokenByEmail(), [email])
  //     .then(result => {
  //       __logger.info('dbData: result then 1', { result })
  //       if (result && result.length === 0) {
  //         passwordTokenData.reject({ type: __constants.RESPONSE_MESSAGES.USER_ID_NOT_EXIST, data: {} })
  //       } else {
  //         passwordTokenData.resolve(result[0])
  //       }
  //     })
  //     .catch(err => passwordTokenData.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err }))
  //   return passwordTokenData.promise
  // }

  // updateExistingPasswordTokens (userId) {
  //   __logger.info('dbData: updateExistingPasswordTokens():')
  //   const existingPasswordTokenUpdated = q.defer()
  //   if (!userId || typeof userId !== 'string') {
  //     existingPasswordTokenUpdated.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Please provide userId of type string' })
  //     return existingPasswordTokenUpdated.promise
  //   }
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.updateExistingPasswordTokens(), [userId, userId])
  //     .then(result => {
  //       __logger.info('dbData: result then 1', { result })
  //       if (result && result.affectedRows && result.affectedRows > 0) {
  //         existingPasswordTokenUpdated.resolve({ user_id: userId })
  //       } else {
  //         existingPasswordTokenUpdated.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
  //       }
  //     })
  //     .catch(err => existingPasswordTokenUpdated.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err }))
  //   return existingPasswordTokenUpdated.promise
  // }

  // addPasswordToken (userId, expiresIn) {
  //   __logger.info('dbData: addPasswordToken():')
  //   const passwordTokenAdded = q.defer()
  //   if (!userId || typeof userId !== 'string') {
  //     passwordTokenAdded.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Please provide userId of type string' })
  //     return passwordTokenAdded.promise
  //   }
  //   if (!expiresIn || typeof expiresIn !== 'number') {
  //     passwordTokenAdded.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Please provide expiresIn of type integer' })
  //     return passwordTokenAdded.promise
  //   }
  //   const token = this.uniqueId.uuid()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.addPasswordToken(), [userId, token, expiresIn, userId])
  //     .then(result => {
  //       __logger.info('dbData: result then 1', { result })
  //       if (result && result.affectedRows && result.affectedRows > 0) {
  //         passwordTokenAdded.resolve({ userId, token })
  //       } else {
  //         passwordTokenAdded.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
  //       }
  //     })
  //     .catch(err => passwordTokenAdded.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err }))
  //   return passwordTokenAdded.promise
  // }

  // getTokenDetailsFromToken (token) {
  //   __logger.info('dbData: getTokenDetailsFromToken():')
  //   const tokenDetails = q.defer()
  //   if (!token || typeof token !== 'string') {
  //     tokenDetails.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Please provide token of type string' })
  //     return tokenDetails.promise
  //   }
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getTokenDetailsFromToken(), [token])
  //     .then(result => {
  //       __logger.info('dbData: result then 1', { result })
  //       if (result && result.length === 0) {
  //         tokenDetails.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_PASS_TOKEN, data: {} })
  //       } else {
  //         tokenDetails.resolve(result[0])
  //       }
  //     })
  //     .catch(err => tokenDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err }))
  //   return tokenDetails.promise
  // }

  // updatePassword (userId, newPassword) {
  //   __logger.info('dbData: updatePassword():')
  //   const passwordUpdated = q.defer()
  //   if (!userId || typeof userId !== 'string') {
  //     passwordUpdated.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Please provide userId of type string' })
  //     return passwordUpdated.promise
  //   }
  //   if (!newPassword || typeof newPassword !== 'string') {
  //     passwordUpdated.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Please provide newPassword of type string' })
  //     return passwordUpdated.promise
  //   }
  //   const passwordSalt = passMgmt.genRandomString(16)
  //   const hashPassword = passMgmt.create_hash_of_password(newPassword, passwordSalt).passwordHash
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.updatePassword(), [hashPassword, passwordSalt, userId, userId])
  //     .then(result => {
  //       __logger.info('dbData: result then 1', { result })
  //       if (result && result.affectedRows && result.affectedRows > 0) {
  //         passwordUpdated.resolve({ userId })
  //       } else {
  //         passwordUpdated.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
  //       }
  //     })
  //     .catch(err => passwordUpdated.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err }))
  //   return passwordUpdated.promise
  // }

  // setPasswordTokeConsumed (token, userId) {
  //   __logger.info('dbData: setPasswordTokeConsumed():')
  //   const passwordTokenConsumed = q.defer()
  //   if (!token || typeof token !== 'string') {
  //     passwordTokenConsumed.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Please provide token of type string' })
  //     return passwordTokenConsumed.promise
  //   }
  //   if (!userId || typeof userId !== 'string') {
  //     passwordTokenConsumed.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Please provide userId of type string' })
  //     return passwordTokenConsumed.promise
  //   }
  //   __logger.info('dbData: here to update ---------->', token, userId)
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.setPasswordTokeConsumed(), [userId, userId, token])
  //     .then(result => {
  //       __logger.info('dbData: updated ------------->', { result })
  //       if (result && result.affectedRows && result.affectedRows > 0) {
  //         passwordTokenConsumed.resolve({ token })
  //       } else {
  //         passwordTokenConsumed.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
  //       }
  //     })
  //     .catch(err => passwordTokenConsumed.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err }))
  //   return passwordTokenConsumed.promise
  // }

  // getEmailAndFirstNameFromUserId (userId) {
  //   const userDataFetched = q.defer()
  //   if (!userId || typeof userId !== 'string') {
  //     userDataFetched.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Please provide userId of type string' })
  //     return userDataFetched.promise
  //   }
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getEmailAndFirstNameByUserId(), [userId])
  //     .then(result => {
  //       if (result && result.length === 0) {
  //         userDataFetched.reject({ type: __constants.RESPONSE_MESSAGES.USER_ID_NOT_EXIST, data: {} })
  //       } else {
  //         userDataFetched.resolve(result[0])
  //       }
  //     })
  //     .catch(err => userDataFetched.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err }))
  //   return userDataFetched.promise
  // }

  // getPasswordByUserId (userId) {
  //   __logger.info('dbData: getUSerDataByUserId():')
  //   const userDetails = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getPasswordByUserId(), [userId])
  //     .then(result => {
  //       __logger.info('dbData: Qquery Result', result[0])
  //       if (result && result.length === 0) {
  //         userDetails.reject({ type: __constants.RESPONSE_MESSAGES.NOT_AUTHORIZED, data: {} })
  //       } else {
  //         userDetails.resolve(result[0])
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in get user function: ', err)
  //       userDetails.reject({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || err })
  //     })
  //   return userDetails.promise
  // }

  // getAccountProfileByUserId (userId) {
  //   __logger.info('dbData: getUSerDataByUserId():')
  //   const userDetails = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserAccountProfile(), [userId])
  //     .then(result => {
  //       __logger.info('dbData: Qquery Result', result[0])
  //       if (result && result.length === 0) {
  //         userDetails.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, data: {} })
  //       } else {
  //         userDetails.resolve(result[0])
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in get user details by userId function: ', err)
  //       userDetails.reject({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || err })
  //     })
  //   return userDetails.promise
  // }

  // getAccountProfileList (ItemsPerPage, offset) {
  //   __logger.info('dbData: getAccountProfileList():')
  //   const userDetails = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getAccountProfileList(), [ItemsPerPage, offset])
  //     .then(result => {
  //       __logger.info('dbData: Qquery Result')
  //       if (result && result.length === 0) {
  //         userDetails.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, data: {} })
  //       } else {
  //         userDetails.resolve(result)
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in get account profile list function: ', err)
  //       userDetails.reject({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || err })
  //     })
  //   return userDetails.promise
  // }

  // updateAccountManagerName (accountManagerName, userId) {
  //   __logger.info('dbData: updateAccountManagerName():')
  //   const userDetails = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.updateAccountManagerName(), [accountManagerName, userId])
  //     .then(result => {
  //       __logger.info('dbData: Qquery Result', result)
  //       if (result && result.affectedRows && result.affectedRows > 0) {
  //         userDetails.resolve(result)
  //       } else {
  //         userDetails.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, data: {} })
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in updateAccountManagerName function: ', err)
  //       userDetails.reject({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || err })
  //     })
  //   return userDetails.promise
  // }

  // getAgreementByStatusId (agreementStatus, ItemsPerPage, offset) {
  //   __logger.info('dbData: getAgreementByStatusId():')
  //   const userAgreement = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getAgreementByStatusId(), [agreementStatus, ItemsPerPage, offset, agreementStatus])
  //     .then(result => {
  //       __logger.info('dbData: Qquery Result')
  //       if (result && result[0] && result[0].length === 0) {
  //         userAgreement.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, data: {} })
  //       } else {
  //         userAgreement.resolve(result)
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in getAgreementByStatusId function: ', err)
  //       userAgreement.reject({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || err })
  //     })
  //   return userAgreement.promise
  // }

  // getAgreementInfoById (agreementId) {
  //   __logger.info('dbData: getAgreementInfoById():', agreementId)
  //   const userAgreement = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getAgreementInfoById(), [agreementId])
  //     .then(result => {
  //       __logger.info('dbData: getAgreementInfoById Query Result', result)
  //       if (result && result.length === 0) {
  //         userAgreement.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, data: {} })
  //       } else {
  //         userAgreement.resolve(result[0])
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in getAgreementInfoById function: ', err)
  //       userAgreement.reject({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
  //     })
  //   return userAgreement.promise
  // }

  // getAgreementInfoByUserId (userId) {
  //   __logger.info('dbData: getAgreementInfoByUserId():')
  //   const userAgreement = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getAgreementInfoByUserId(), [userId])
  //     .then(result => {
  //       __logger.info('dbData: Query Result')
  //       if (result && result.length === 0) {
  //         userAgreement.resolve()
  //       } else {
  //         userAgreement.resolve(result[0])
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in getAgreementInfoByUserId function: ', err)
  //       userAgreement.reject({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
  //     })
  //   return userAgreement.promise
  // }

  // insertAgreement (newData, userId, callerUserId) {
  //   __logger.info('dbData: Inserting agreement')
  //   const dataInserted = q.defer()
  //   const uniqueId = new UniqueId()
  //   const agreementStatusEngine = new AgreementStatusEngine()
  //   const agreementData = {
  //     user_agreement_files_id: uniqueId.uuid(),
  //     userId: userId,
  //     fileName: (newData && newData.fileName) ? newData.fileName : null,
  //     filePath: (newData && newData.filePath) ? newData.filePath : null,
  //     agreementStatusId: (newData && newData.agreementStatusId) ? newData.agreementStatusId : null,
  //     createdBy: callerUserId,
  //     updatedBy: callerUserId
  //   }
  //   const queryParam = []
  //   _.each(agreementData, (val) => queryParam.push(val))
  //   __logger.info('dbData: inserttttttttttttttttttttt->', agreementData, queryParam)
  //   if (agreementStatusEngine.canUpdateAgreementStatus(agreementData.agreementStatusId, __constants.AGREEMENT_STATUS.pendingForDownload.statusCode)) {
  //     __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.saveUserAgreement(), queryParam)
  //       .then(result => {
  //         __logger.info('dbData: result', { result })
  //         if (result && result.affectedRows && result.affectedRows > 0) {
  //           dataInserted.resolve(agreementData)
  //         } else {
  //           dataInserted.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
  //         }
  //       })
  //       .catch(err => {
  //         __logger.error('dbData: error: ', err)
  //         dataInserted.reject({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
  //       })
  //   } else {
  //     dataInserted.reject({ type: __constants.RESPONSE_MESSAGES.AGREEMENT_STATUS_CANNOT_BE_UPDATED, data: {} })
  //   }
  //   return dataInserted.promise
  // }

  // updateAgreement (newData, oldData, userId, callerUserId) {
  //   __logger.info('dbData: Updating agreement')
  //   const dataUpdated = q.defer()
  //   const agreementStatusEngine = new AgreementStatusEngine()
  //   const agreementData = {
  //     fileName: newData.fileName ? newData.fileName : oldData.fileName,
  //     filePath: newData.filePath ? newData.filePath : oldData.filePath,
  //     agreementStatusId: newData.agreementStatusId ? newData.agreementStatusId : oldData.agreementStatusId,
  //     updatedBy: callerUserId,
  //     rejectionReason: newData.rejectionReason ? newData.rejectionReason : oldData.rejectionReason,
  //     userId: userId
  //   }
  //   if (agreementData.agreementStatusId && agreementData.agreementStatusId !== __constants.AGREEMENT_STATUS.rejected.statusCode) {
  //     agreementData.rejectionReason = null
  //   }
  //   const queryParam = []
  //   _.each(agreementData, (val) => queryParam.push(val))
  //   __logger.info('dbData: update->', agreementData, queryParam)
  //   if (agreementStatusEngine.canUpdateAgreementStatus(newData.agreementStatusId, oldData.agreementStatusId)) {
  //     __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.updateAgreement(), queryParam)
  //       .then(result => {
  //         __logger.info('dbData: updateAgreement result', { result })
  //         if (result && result.affectedRows && result.affectedRows > 0) {
  //           dataUpdated.resolve(agreementData)
  //         } else {
  //           dataUpdated.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
  //         }
  //       })
  //       .catch(err => {
  //         __logger.error('dbData: error: ', err)
  //         dataUpdated.reject({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
  //       })
  //   } else {
  //     dataUpdated.reject({ type: __constants.RESPONSE_MESSAGES.AGREEMENT_STATUS_CANNOT_BE_UPDATED, err: {} })
  //   }
  //   return dataUpdated.promise
  // }

  // getAllAgreement (columnArray, offset, ItemsPerPage, valArray) {
  //   __logger.info('dbData: Inside getAllAgreement')
  //   const fetchAgreement = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getAgreementList(columnArray), [...valArray, ItemsPerPage, offset])
  //     .then(result => {
  //       if (result && result[0] && result[0].length && result[0].length > 0) {
  //         fetchAgreement.resolve(result)
  //       } else {
  //         fetchAgreement.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, err: {} })
  //       }
  //     })
  //     .catch(err => {
  //       fetchAgreement.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
  //     })
  //   return fetchAgreement.promise
  // }

  // updateAccountConfig (newData, oldData, userId, callerUserId) {
  //   __logger.info('dbData: Updating account config')
  //   const dataUpdated = q.defer()
  //   const accountConfigData = {
  //     tps: newData.tps ? newData.tps : oldData.tps,
  //     updatedBy: callerUserId,
  //     userId: userId
  //   }
  //   const queryParam = []
  //   _.each(accountConfigData, (val) => queryParam.push(val))
  //   __logger.info('dbData: account config data to be updated->', accountConfigData, queryParam)
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.updateAccountConfig(), queryParam)
  //     .then(result => {
  //       __logger.info('dbData: result', { result })
  //       if (result && result.affectedRows && result.affectedRows > 0) {
  //         dataUpdated.resolve(accountConfigData)
  //       } else {
  //         dataUpdated.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error: ', err)
  //       dataUpdated.reject({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
  //     })
  //   return dataUpdated.promise
  // }

  // getAgreementStatusList () {
  //   __logger.info('dbData: inside getAgreementStatusList function')
  //   const agreementData = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getAgreementStatusList(), [])
  //     .then(result => {
  //       __logger.info('dbData: getAgreementStatusList Qquery Result', { result })
  //       if (result && result.length > 0) {
  //         agreementData.resolve(result)
  //       } else {
  //         agreementData.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, err: {} })
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in get template status list function: ', err)
  //       agreementData.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
  //     })
  //   return agreementData.promise
  // }

  // getAccountCreatedTodayCount () {
  //   __logger.info('dbData: get Account Created Today Count Service():')
  //   const userDetails = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getAccountCreatedTodayCount(), [])
  //     .then(result => {
  //       __logger.info('dbData: get Account Created Today Count Service Result():', { result })
  //       if (result && result.length === 0) {
  //         userDetails.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, data: {} })
  //       } else {
  //         userDetails.resolve(result[0])
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in get Account Created Today Count function: ', err)
  //       userDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
  //     })
  //   return userDetails.promise
  // }

  // getAgreementStatusCount () {
  //   __logger.info('dbData: get Agreement Status Count Service():')
  //   const userDetails = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getAgreementStatusCount(), [])
  //     .then(result => {
  //       __logger.info('dbData: get Agreement Count Status Service Result():', { result })
  //       if (result && result.length === 0) {
  //         userDetails.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, data: {} })
  //       } else {
  //         userDetails.resolve(result)
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in get Agreement Status Count function: ', err)
  //       userDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
  //     })
  //   return userDetails.promise
  // }

  // getUserData () {
  //   __logger.info('dbData: <<<<<<<<<<<<< user.services.dbData: getUserData(): create dynamic queue per User ():')
  //   const userDetails = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserData())
  //     .then(result => {
  //       __logger.info('dbData: response getUserData():', { result })
  //       if (result && result.length === 0) {
  //         userDetails.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, data: {} })
  //       } else {
  //         const singleNewObject = {}
  //         result.forEach(singleObject => {
  //           singleNewObject[singleObject.userId] = singleObject
  //           __constants.MQ['fbOutgoing_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber] = JSON.parse(JSON.stringify(__constants.MQ.fbOutgoing))
  //           __constants.MQ['fbOutgoingSync_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber] = JSON.parse(JSON.stringify(__constants.MQ.fbOutgoingSync))
  //           __constants.MQ['webhookHeloCampaign_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber] = JSON.parse(JSON.stringify(__constants.MQ.webhookHeloCampaign))
  //           __constants.MQ['webhookQueue_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber] = JSON.parse(JSON.stringify(__constants.MQ.webhookQueue))
  //           __constants.MQ['pre_process_message_campaign_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber] = JSON.parse(JSON.stringify(__constants.MQ.pre_process_message_campaign))
  //           __constants.MQ['process_message_campaign_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber] = JSON.parse(JSON.stringify(__constants.MQ.process_message_campaign))
  //           __constants.MQ['fbOutgoing_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber].q_name = __constants.MQ.fbOutgoing.q_name + '_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber
  //           __constants.MQ['fbOutgoingSync_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber].q_name = __constants.MQ.fbOutgoingSync.q_name + '_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber
  //           __constants.MQ['webhookHeloCampaign_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber].q_name = __constants.MQ.webhookHeloCampaign.q_name + '_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber
  //           __constants.MQ['webhookQueue_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber].q_name = __constants.MQ.webhookQueue.q_name + '_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber
  //           __constants.MQ['pre_process_message_campaign_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber].q_name = __constants.MQ.pre_process_message_campaign.q_name + '_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber
  //           __constants.MQ['process_message_campaign_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber].q_name = __constants.MQ.process_message_campaign.q_name + '_' + singleObject.userId + '_' + singleObject.phoneCode + singleObject.phoneNumber
  //         })
  //         __logger.info('dbData: <<<<<<<<<<<<< created per user Queue success >>>>>>>>>>>>>>')
  //         userDetails.resolve(result)
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in  getUserData for dynamic per user queue :  ', err)
  //       userDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
  //     })
  //   return userDetails.promise
  // }

  // getPhoneNumbersFromWabaId (wabaIdOfClient) {
  //   // wabaIdOfClient="b6210d2f-acb3-4dfa-8b52-0972c8045706"
  //   __logger.info('dbData: getPhoneNumbersFromWabaIde():')
  //   const userDetails = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getPhoneNumbersFromWabaId(), [wabaIdOfClient])
  //     .then(result => {
  //       __logger.info('dbData: getPhoneNumbersFromWabaId():', { result })
  //       userDetails.resolve(result)
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in getPhoneNumbersFromWabaId: ', err)
  //       userDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
  //     })
  //   return userDetails.promise
  // }

  // updateWabizInformation (wabizusername, wabizpassword, wabizurl, graphapikey, phoneCode, phoneNumber) {
  //   __logger.info('dbData: updateWabizInformation():')
  //   const apiCall = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.updateWabizInformation(), [wabizusername, wabizpassword, wabizurl, graphapikey, phoneCode, phoneNumber])
  //     .then(result => {
  //       __logger.info('dbData: updateWabizInformation():', { result })
  //       if (result && result.affectedRows && result.affectedRows > 0) {
  //         apiCall.resolve(result)
  //       } else {
  //         apiCall.resolve({ data: {} })
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in updateWabizInformation: ', err)
  //       apiCall.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
  //     })
  //   return apiCall.promise
  // }

  // sendMessageToSupport (url, errorMessage) {
  //   const supportEmails = q.defer()
  //   const agreementStatusService = new AgreementStatusEngine()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getUserRoleData(), [])
  //     .then(emails => {
  //       // const supportEmail = emails[0].email.split(',')
  //       // const supportEmail = ['8097@yopmail.com']
  //       const supportEmail = emails[0].email.split(',')
  //       __logger.info('dbData: sendMessageToSupport(): supportEmail:', supportEmail)
  //       return agreementStatusService.sendEmailsToSupports(supportEmail, url, errorMessage)
  //     })
  //     .then(result => {
  //       supportEmails.resolve(result)
  //     })
  //     .catch(err => {
  //       supportEmails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
  //     })
  //   return supportEmails.promise
  // }

  // updateTfaPinInformation (phoneCode, phoneNumber, tfaPin) {
  //   __logger.info('dbData: updateWabizInformation():')
  //   const apiCall = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.updateTfaPinInformation(), [tfaPin, phoneCode, phoneNumber])
  //     .then(result => {
  //       __logger.info('dbData: updateWabizInformation():', { result })
  //       if (result && result.affectedRows && result.affectedRows > 0) {
  //         apiCall.resolve(result)
  //       } else {
  //         apiCall.resolve({ data: {} })
  //       }
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in updateWabizInformation: ', err)
  //       apiCall.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
  //     })
  //   return apiCall.promise
  // }

  // getWabaProfileSetupStatusFromUserId (userId) {
  //   __logger.info('dbData: getWabaProfileSetupStatusFromUserId():')
  //   const userDetails = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getWabaProfileSetupStatus(), [userId])
  //     .then(result => {
  //       __logger.info('dbData: getWabaProfileSetupStatusFromUserId():', { result })
  //       userDetails.resolve(result)
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in getWabaProfileSetupStatusFromUserId: ', err)
  //       userDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
  //     })
  //   return userDetails.promise
  // }

  // getEmbeddedSingupData (embeddedsingupid) {
  //   __logger.info('dbData: getWabaProfileSetupStatusFromUserId():')
  //   const userDetails = q.defer()
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, queryProvider.getEmbeddedSingupData(), [embeddedsingupid])
  //     .then(result => {
  //       __logger.info('dbData: getWabaProfileSetupStatusFromUserId():', { result })
  //       userDetails.resolve(result)
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in getWabaProfileSetupStatusFromUserId: ', err)
  //       userDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
  //     })
  //   return userDetails.promise
  // }

  // addEmbbeddedSingupErrorData (query, paramsArray) {
  //   const addEmbbeddedSingupErrorData = q.defer()
  //   __logger.info('dbData: addEmbbeddedSignUpErrorData:', query)
  //   __db.mysql.query(__constants.HW_MYSQL_NAME, query, paramsArray)
  //     .then(result => {
  //       __logger.info('dbData: getWabaProfileSetupStatusFromUserId():', { result })
  //       addEmbbeddedSingupErrorData.resolve(result)
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in getWabaProfileSetupStatusFromUserId: ', err)
  //       addEmbbeddedSingupErrorData.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
  //     })
  //   return addEmbbeddedSingupErrorData.promise
  // }
}

module.exports = UserData
