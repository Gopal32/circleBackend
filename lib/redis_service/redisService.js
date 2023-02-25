const q = require('q')
const _ = require('lodash')
const __db = require('../db')
const __constants = require('../../config/constants')
const __logger = require('../logger')
// const queryProvider = require('./queryProvider')
// const rejectionHandler = require('../util/rejectionHandler')
// const { getTemplateIdData } = require('../../app_modules/front_end/controllers/optinAndTemplate')
// const e164 = require('e164')
// const csc = require('country-state-city').default
// const phoneCodeAndPhoneSeprator = require('../util/phoneCodeAndPhoneSeprator')
// const TemplateService = require('../../app_modules/templates/services/dbData')

class RedisService {
    constructor() {
    }

    setEmailOtp(userId, code, expirySec) {
        const dataInRedis = q.defer()
        __logger.info('redisService: setEmailOtp', userId)
        __db.redis.setex(`${ __constants.EMAIL_OTP_KEY}${userId}`, code, expirySec)
            .then(data => {
                if(data && data === 'OK') dataInRedis.resolve(true)
                else dataInRedis.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err }) 
            })
            .catch(err => {
                __logger.error('redisService: setEmailOtp(' + userId + '): catch:', err)
                dataInRedis.reject({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || err })
            })
        return dataInRedis.promise
    }

    getOtpCode(userId, code){
        const dataInRedis = q.defer()
        __logger.info('redisService: getOtpCode', userId)
        __db.redis.get(`${ __constants.EMAIL_OTP_KEY}${userId}`, code)
            .then(data => {
                if(data && data !== null) dataInRedis.resolve(data)
                else dataInRedis.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_OTP, err: 'Please enter a valid code' }) 
            })
            .catch(err => {
                __logger.error('redisService: getOtpCode(' + userId + '): catch:', err)
                dataInRedis.reject({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || err })
            })
        return dataInRedis.promise
    }
}

module.exports = RedisService