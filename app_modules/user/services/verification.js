const q = require('q')
const __constants = require('../../../config/constants')
var __config = require('../../../config')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const EmailService = require('../../../lib/sendNotifications/email')
const emailTemplates = require('../../../lib/sendNotifications/emailTemplates')
const __logger = require('../../../lib/logger')
const RedisService = require('../../../lib/redis_service/redisService')

class VerificationService {
  constructor () {
    this.uniqueId = new UniqueId()
  }

  addVerificationCode (userId, expiresIn, codeLength) {
    __logger.info('addVerificationCode:')
    const verificationDataAdded = q.defer()
    const redisService = new RedisService()
    const code = this.uniqueId.randomInt(codeLength)
    redisService.setEmailOtp(userId, code, expiresIn)
      .then(result => {
        if (result) {
          verificationDataAdded.resolve({ userId, code })
        } else {
          verificationDataAdded.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => verificationDataAdded.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err }))
    return verificationDataAdded.promise
  }

  sendVerificationCodeByEmail (code, email) {
    __logger.info('sendVerificationCodeByEmail:')
    const emailSent = q.defer()
    const emailService = new EmailService(__config.emailProvider)
    emailService.sendEmail([email], __config.emailProvider.subject.emailVerification, emailTemplates.verificationCodeTemplate(code))
      .then(data => emailSent.resolve(data))
      .catch(err => emailSent.reject(err))
    return emailSent.promise
  }
}

module.exports = VerificationService
