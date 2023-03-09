const q = require('q')
const _ = require('lodash')
const Validator = require('jsonschema').Validator
const v = new Validator()
const __constants = require('../../../config/constants')
const TrimService = require('../../../lib/trimService/trim')
const trimInput = new TrimService()

class validate {
  checkPlanName (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkPlanNameAPi',
      type: 'object',
      required: true,
      properties: {
        planName: {
          type: 'string',
          required: true,
          minLength: 1,
          enum: ['basic', 'silver', 'gold']
        }
      }
    }
    const formatedError = []
    v.addSchema(schema, '/checkPlanNameAPi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError })
    } else {
      trimInput.singleInputTrim(request)
      isvalid.resolve(request)
    }
    return isvalid.promise
  }
}

module.exports = validate
