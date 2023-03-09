const q = require('q')
const _ = require('lodash')
const Validator = require('jsonschema').Validator
const v = new Validator()
const __constants = require('../../../config/constants')
const TrimService = require('../../../lib/trimService/trim')
const trimInput = new TrimService()

class validate {
  newsTemplate (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/updateCategoryAPi',
      type: 'object',
      required: true,
      properties: {
        newsTitle: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        newsDescription: {
          type: 'string',
          required: true,
          minLength: 1
        },
        newsUrl: {
          type: 'array',
          required: true,
          minLength: 1,
          items: {
            type: 'string',
            minLength: 1,
            maxLength: 250
          }
        },
        categoryId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      }
    }
    const formatedError = []
    v.addSchema(schema, '/updateCategoryAPi')
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

  newsUpdateTemplate (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/updateCategoryAPi',
      type: 'object',
      required: true,
      properties: {
        newsId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        newsTitle: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        newsDescription: {
          type: 'string',
          required: true,
          minLength: 1
        },
        newsUrl: {
          type: 'array',
          required: true,
          minLength: 1,
          items: {
            type: 'string',
            minLength: 1,
            maxLength: 250
          }
        },
        categoryId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      }
    }
    const formatedError = []
    v.addSchema(schema, '/updateCategoryAPi')
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

  checkFollowerId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkFollowerId',
      type: 'object',
      required: true,
      properties: {
        followerId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        limit: {
          type: 'string',
          required: false,
          pattern: __constants.VALIDATOR.number
        },
        page: {
          type: 'string',
          required: false,
          pattern: __constants.VALIDATOR.number
        }
      }
    }
    const formatedError = []
    v.addSchema(schema, '/checkFollowerId')
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

  checkPagination (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkFollowerId',
      type: 'object',
      required: true,
      properties: {
        limit: {
          type: 'string',
          required: false,
          pattern: __constants.VALIDATOR.number
        },
        page: {
          type: 'string',
          required: false,
          pattern: __constants.VALIDATOR.number
        }
      }
    }
    const formatedError = []
    v.addSchema(schema, '/checkFollowerId')
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

  checkNewsId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkNewsId',
      type: 'object',
      required: true,
      properties: {
        newsId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      }
    }
    const formatedError = []
    v.addSchema(schema, '/checkNewsId')
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
