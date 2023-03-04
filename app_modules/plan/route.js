const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth/authentication')
const authstrategy = require('../../config').authentication

// Routes
// Plan routes
router.get('/', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/checkPlan.js'))
router.post('/', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/selectPlan.js'))

module.exports = router
