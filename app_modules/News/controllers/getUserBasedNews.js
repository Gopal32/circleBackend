const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const NewsService = require('../services/dbData')
const PlanService = require('../../plan/services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const getUserBasedNews = (req, res) => {
  __logger.info('inside getUserBasedNews :: ')
  const userId = req.user && req.user.userId ? req.user.userId : 0
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const validate = new ValidationService()
  const newsService = new NewsService()
  const planService = new PlanService()
  // let limit = 0
  // let page = 0

  validate.checkFollowerId(req.query)
    .then(data => {
      if (req.query.followerId === userId) {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.NOT_USERID, data: {} })
      } else {
        return planService.checkPlan(planId)
      }
    })
    .then(data => {
      __logger.info('getUserBasedNews function', data)
      if (data && data.seeNews) {
        // limit = req.query.limit ? +req.query.limit : 10
        // page = req.query.page ? +req.query.page : 1
        return newsService.checkUsersNews(req.query.followerId)
      } else {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, data: {} })
      }
    })
    .then(data => {
      // const pagination = { totalPage: Math.ceil(data[0].totalCount[0].count / limit), totalCount: data[0].totalCount[0].count, currentPage: page }
      __logger.info('getUserBasedNews function :: Then 2', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: data })
    })
    .catch(err => {
      __logger.error('getUserBasedNews function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getUserBasedNews
