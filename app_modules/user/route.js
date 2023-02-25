const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth/authentication')
// const tokenBasedAuth = require('../../middlewares/auth/tokenBasedAuth')
const authstrategy = require('../../config').authentication
// const internalSessionOrTokenAuth = require('../../middlewares/auth/internalSessionOrTokenAuth')
// const bearerTokenAuth = require('../../middlewares/auth/bearerTokenAuth')
// const __logger = require('../../lib/logger')
// const apiHitsAllowedMiddleware = require('../../middlewares/apiHitsAllowed')

// Controller require section
// const accountProfileController = require('./controllers/accoutProfile')
// const accountTypeController = require('./controllers/accountType')
// const billingProfileController = require('./controllers/billingProfile')
// const verificationController = require('./controllers/verification')
// const agreementController = require('./controllers/agreement')
// const accountConfigController = require('./controllers/config')
// const countController = require('./controllers/count')

// Routes
// User routes
router.post('/auth/login', require('./controllers/login'))
router.post('/signup', require('./controllers/signUp').controllerSignUp)
router.post('/resend/otp', require('./controllers/signUp').resendOtp)
router.patch('/setusername', require('./controllers/signUp').setUsername)
router.post('/verification/otp', require('./controllers/verification').otp)
router.get('/email/verify', require('./controllers/signUp').emailVerify)
router.get('/username/verify', require('./controllers/signUp').usernameVerify)
router.post('/forgetpassword', require('./controllers/signUp').forgetPwd)

// router.post('/auth/forgetpassword', require('./controllers/passwordManagement').forgetPassword)
router.post('/auth/changepassword', require('./controllers/passwordManagement').changePassword)
router.put('/logo', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/userDetails').updateProfilePic)
// router.get('/auth/google', authMiddleware.authenticate(authstrategy.google.name, authstrategy.google.options))
// router.get('/auth/facebook', authMiddleware.authenticate(authstrategy.facebook.name, authstrategy.google.options))
// router.post('/authorize', bearerTokenAuth, require('./controllers/authorize').authorize)
// router.post('/authorize/support', require('./controllers/authorize').authorizeSupportUser)
// router.post('/internal/authorize', tokenBasedAuth, require('./controllers/authorize').authorize)
// router.patch('/auth/resetpassword', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, require('./controllers/passwordManagement').resetPasssword)

// // Oauth user data comes to these redirectURLs
// router.get('/googleRedirect', authMiddleware.authenticate(authstrategy.google.name), (req, res) => {
//   __logger.info('redirected', req.user)
//   const user = {
//     displayName: req.user.displayName,
//     name: req.user.name.givenName,
//     email: req.user._json.email
//     // provider: req.user.provider
//   }
//   const token = authMiddleware.setToken(user, 600)
//   res.send(token)
// })
// router.get('/facebookRedirect', authMiddleware.authenticate(authstrategy.facebook.name), (req, res) => {
//   __logger.info('redirected', req.user)
//   const user = {
//     displayName: req.user.displayName,
//     name: req.user._json.name,
//     email: req.user._json.email
//     // provider: req.user.provider
//   }
//   const token = authMiddleware.setToken(user, 600)
//   res.send(token)
// })

// // Account Profile routes
// router.get('/account', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, accountProfileController.getAcountProfile)
// router.put('/account', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, accountProfileController.updateAcountProfile)
// router.get('/accountType', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, accountTypeController.getAcountType)
// router.put('/account/tokenKey', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, accountProfileController.generateAndUpdateTokenKey)
// router.get('/account/info', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, accountProfileController.getAccountProfileByUserId)
// router.get('/account/list', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, accountProfileController.getAccountProfileList)
// router.patch('/account/accountManager', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, accountProfileController.updateAccountManagerName)

// // Billing Profile routes
// router.get('/billing', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, billingProfileController.getBusinessBilllingProfile)
// router.post('/billing', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, billingProfileController.addBusinessBilllingProfile)

// Verification routes
// router.post('/verification/email', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, verificationController.generateEmailVerificationCode)
// router.patch('/verification/email', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, verificationController.validateEmailVerificationCode)
// router.post('/verification/sms', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, verificationController.generateSmsVerificationCode)
// router.patch('/verification/sms', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, verificationController.validateSmsVerificationCode)
// router.post('/otp/email', tokenBasedAuth, verificationController.generateEmailOtpCode) // internally called by /otp
// router.post('/otp/sms', tokenBasedAuth, verificationController.generateSmsOtpCode) // internally called by /otp
// router.post('/otp', internalSessionOrTokenAuth, apiHitsAllowedMiddleware, verificationController.sendOtpCode)
// router.patch('/otp', internalSessionOrTokenAuth, apiHitsAllowedMiddleware, verificationController.validateTFa)
// router.patch('/otp/new', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, verificationController.validateTempTFa)
// router.patch('/otp/backup', internalSessionOrTokenAuth, apiHitsAllowedMiddleware, verificationController.validateBackupCodeAndResetTfa)
// router.post('/tfa', authMiddleware.authenticate(authstrategy.jwt.name, authstrategy.jwt.options), apiHitsAllowedMiddleware, verificationController.addTempTfaData)

module.exports = router
