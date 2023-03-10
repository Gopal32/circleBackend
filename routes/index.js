const dateUtil = require('date-format-utils')
const __config = require('../config')
const __logger = require('../lib/logger')
const user = require('../app_modules/user/route')
const category = require('../app_modules/category/route')
const mapped = require('../app_modules/userMapped/route')
const plan = require('../app_modules/plan/route')

module.exports = function (app) {
  // region all api
  app.all('*', function (request, response, next) {
    const uuid = request.id
    request.req_ip = (request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'].split(',').shift().trim() : request.ip)
    const startTime = new Date()
    request.req_t = startTime
    __logger.info('routes.index: ' + uuid + '=> API REQUEST:: ', { req_ip: request.req_ip, uri: request.originalUrl, req_t: dateUtil.formatDate(startTime, 'yyyy-MM-dd HH:mm:ss.SSS') })
    response.on('finish', function () {
      const endTime = new Date()
      const responseTime = endTime - startTime
      __logger.info('routes.index: ' + uuid + '=> API RESPONSE:: ', { req_ip: request.req_ip, uri: request.originalUrl, req_t: dateUtil.formatDate(startTime, 'yyyy-MM-dd HH:mm:ss.SSS'), res_t: dateUtil.formatDate(endTime, 'yyyy-MM-dd HH:mm:ss.SSS'), res_in: (responseTime / 1000) + 'sec' })
    })
    next()
  })
  // endregion

  // region api routes
  const apiUrlPrefix = '/' + __config.api_prefix + '/api'
  app.use(apiUrlPrefix + '/users', user)
  app.use(apiUrlPrefix + '/category', category)
  app.use(apiUrlPrefix + '/mapped', mapped)
  app.use(apiUrlPrefix + '/plan', plan)
  require('../lib/swagger')(app, '/' + __config.api_prefix + '/api')
  // endregion
}
