const q = require('q')
const _ = require('lodash')
const Validator = require('jsonschema').Validator
const v = new Validator()
const __constants = require('../../../config/constants')
const TrimService = require('../../../lib/trimService/trim')
const trimInput = new TrimService()

class validate {
  checkCategoryId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkCategoryIdAPi',
      type: 'object',
      required: true,
      properties: {
        categoryId: {
          type: 'array',
          required: true,
          minLength: 1,
          items: {
            type: 'string',
            minLength: 1,
            maxLength: 50
          }
        }
      }
    }
    const formatedError = []
    v.addSchema(schema, '/checkCategoryIdAPi')
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

  checkFollowId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkFollowIdApi',
      type: 'object',
      required: true,
      properties: {
        followingId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      }
    }
    const formatedError = []
    v.addSchema(schema, '/checkFollowIdApi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError })
    } else {
      trimInput.singleInputTrim(request)
        .then(data => isvalid.resolve(data))
    }
    return isvalid.promise
  }

  // checkOtp (request) {
  //   const isvalid = q.defer()
  //   const schema = {
  //     id: '/checkOtpApi',
  //     type: 'object',
  //     required: true,
  //     properties: {
  //       userId: {
  //         type: 'string',
  //         required: true,
  //         minLength: 1,
  //         maxLength: 50
  //       },
  //       code: {
  //         type: 'number',
  //         required: true,
  //         minLength: 6,
  //         maxLength: 6
  //       }
  //     }
  //   }
  //   const formatedError = []
  //   v.addSchema(schema, '/checkOtpApi')
  //   const error = _.map(v.validate(request, schema).errors, 'stack')
  //   _.each(error, function (err) {
  //     const formatedErr = err.split('.')
  //     formatedError.push(formatedErr[formatedErr.length - 1])
  //   })
  //   if (formatedError.length > 0) {
  //     isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError })
  //   } else {
  //     trimInput.singleInputTrim(request)
  //       .then(data => isvalid.resolve(data))
  //   }
  //   return isvalid.promise
  // }

  // checkUserName (request) {
  //   const isvalid = q.defer()
  //   const schema = {
  //     id: '/checkUserNameApi',
  //     type: 'object',
  //     required: true,
  //     properties: {
  //       userName: {
  //         type: 'string',
  //         required: true,
  //         minLength: 1,
  //         maxLength: 50
  //       }
  //     }
  //   }
  //   const formatedError = []
  //   v.addSchema(schema, '/checkUserNameApi')
  //   const error = _.map(v.validate(request, schema).errors, 'stack')
  //   _.each(error, function (err) {
  //     const formatedErr = err.split('.')
  //     formatedError.push(formatedErr[formatedErr.length - 1])
  //   })
  //   if (formatedError.length > 0) {
  //     isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError })
  //   } else {
  //     trimInput.singleInputTrim(request)
  //       .then(data => isvalid.resolve(data))
  //   }
  //   return isvalid.promise
  // }

  // checkUserId (request) {
  //   const isvalid = q.defer()
  //   const schema = {
  //     id: '/checkUserIdApi',
  //     type: 'object',
  //     required: true,
  //     properties: {
  //       userId: {
  //         type: 'string',
  //         required: true,
  //         minLength: 1,
  //         maxLength: 50
  //       }
  //     }
  //   }
  //   const formatedError = []
  //   v.addSchema(schema, '/checkUserIdApi')
  //   const error = _.map(v.validate(request, schema).errors, 'stack')
  //   _.each(error, function (err) {
  //     const formatedErr = err.split('.')
  //     formatedError.push(formatedErr[formatedErr.length - 1])
  //   })
  //   if (formatedError.length > 0) {
  //     isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError })
  //   } else {
  //     trimInput.singleInputTrim(request)
  //       .then(data => isvalid.resolve(data))
  //   }
  //   return isvalid.promise
  // }
}

module.exports = validate
