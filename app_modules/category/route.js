const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth/authentication')
const authstrategy = require('../../config').authentication

// Routes
// Category routes
router.get('/', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/getCategory'))
router.get('/admin/', require('./controllers/getCategoryForAdmin'))
router.post('/admin/', require('./controllers/addCategoryForAdmin.js'))

module.exports = router
