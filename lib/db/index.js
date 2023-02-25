const config = require('../../config')
const __logger = require('../../lib/logger')

class Databases {
  constructor () {
    __logger.info('databases constructor called.')
    this.redis = require('./redis_local.js')
    // this.mongo = require('./mongo.js')
    this.mysql = require('./mysql.js')
    // this.mysqlMis = require('./mysql.js')
    // this.rabbitmqHeloWhatsapp = require('./rabbitmq_helo_whatsapp.js')
  }

  async init () {
    await this.redis.init()
    // await this.mongo.init()
    await this.mysql.init(config.test.name)
    // await this.mysqlMis.init(config.helo_whatsapp_mis_mysql.name)

    // await this.rabbitmqHeloWhatsapp.init()
    return 'connections open.'
  }

  async close () {
    await this.redis.close()
    // await this.mongo.close()
    await this.mysql.close(config.test.name)
    // await this.mysqlMis.close(config.helo_whatsapp_mis_mysql.name)
    // await this.rabbitmqHeloWhatsapp.close()
    return 'connection closed.'
  }
}

module.exports = new Databases()
