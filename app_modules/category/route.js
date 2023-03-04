const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth/authentication')
const authstrategy = require('../../config').authentication

// Routes
// Category routes
// router.post('/auth/login', require('./controllers/login'))
// router.post('/signup', require('./controllers/signUp').controllerSignUp)
// router.post('/resend/otp', require('./controllers/signUp').resendOtp)
// router.patch('/setusername', require('./controllers/signUp').setUsername)
// router.post('/verification/otp', require('./controllers/verification').otp)
router.get('/', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/getCategory'))
router.get('/admin/', require('./controllers/getCategoryForAdmin'))
router.post('/admin/', require('./controllers/addCategoryForAdmin.js'))
// router.post('/', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/getCategory'))
// router.get('/username/verify', require('./controllers/signUp').usernameVerify)
// router.post('/forgetpassword', require('./controllers/signUp').forgetPwd)

// router.post('/auth/forgetpassword', require('./controllers/passwordManagement').forgetPassword)
// router.patch('/changepassword', require('./controllers/passwordManagement').changePassword)
// router.put('/logo', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/userDetails').updateProfilePic)

module.exports = router
