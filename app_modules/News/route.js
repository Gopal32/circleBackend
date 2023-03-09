const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth/authentication')
const authstrategy = require('../../config').authentication
const apiHitsAllowedMiddleware = require('../../middlewares/apiHitsAllowed')
const planExpiryMiddleware = require('../../middlewares/checkFreePlan')

// Routes
// Category routes
router.put('/addNewsMultiMedia', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/addNewsMultiMedia.js'))
router.post('/addNews', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/addNews.js'))
router.put('/updateNews', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/updateNews.js'))
router.get('/getUserBasedNews', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getUserBasedNews.js'))
router.get('/getNews', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getNews.js'))
router.get('/getNewsDetail', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getNewsDetail.js'))
router.delete('/deleteNewsDetail', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/deleteNewsDetail.js'))
router.get('/getSuggestedNews', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getSuggestedNews.js'))

module.exports = router
