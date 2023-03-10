const request = require('request')
var __logger = require('../../lib/logger')
const q = require('q')
class HttpRequest {
  constructor (timeout) {
    this.timeInSeconds = timeout || 3 * 60 * 60 * 1000 // hour * minutes * seconds * miliseconds
  }

  Post (inputRequest, inputReqType, url, headers) {
    const deferred = q.defer()
    const options = {
      method: 'POST',
      url: url,
      timeout: this.timeInSeconds,
      headers: headers,
      [inputReqType]: inputRequest,
      json: true,
      rejectUnauthorized: false
    }
    request(options, (error, response, body) => {
      if (error) {
        __logger.error('http_service.index: POST request: ', error)
        deferred.reject(error)
      } else {
        deferred.resolve(response)
      }
    })
    return deferred.promise
  }

  Get (url, headers) {
    const deferred = q.defer()
    const options = {
      method: 'GET',
      url: url,
      timeout: this.timeInSeconds,
      headers: headers,
      json: true,
      rejectUnauthorized: false
    }
    request(options, (error, response, body) => {
      if (error) {
        __logger.error('http_service.index: GET request: ', error, body)
        deferred.reject(error)
      } else {
        deferred.resolve(body)
      }
    })
    return deferred.promise
  }

  Patch (inputRequest, url, headers, inputReqType = 'body') {
    const deferred = q.defer()
    const options = {
      method: 'PATCH',
      url: url,
      timeout: this.timeInSeconds,
      headers: headers,
      [inputReqType]: inputRequest,
      json: true,
      rejectUnauthorized: false
    }
    request(options, (error, response, body) => {
      if (error) {
        __logger.error('http_service.index: PATCH request: ', error, body)
        deferred.reject(error)
      } else {
        deferred.resolve(body)
      }
    })
    return deferred.promise
  }

  Put (inputRequest, inputReqType, url, headers, isJson) {
    const deferred = q.defer()
    const options = {
      method: 'PUT',
      url: url,
      timeout: this.timeInSeconds,
      headers: headers,
      [inputReqType]: inputRequest,
      json: isJson,
      rejectUnauthorized: false
    }
    request(options, (error, response, body) => {
      if (error) {
        __logger.error('http_service.index: PUT request: ', error, body)
        deferred.reject(error)
      } else {
        deferred.resolve(body)
      }
    })
    return deferred.promise
  }

  Delete (url, headers) {
    const deferred = q.defer()
    const options = {
      method: 'DELETE',
      url: url,
      timeout: this.timeInSeconds,
      headers: headers,
      json: true,
      rejectUnauthorized: false
    }
    request(options, (error, response, body) => {
      if (error) {
        __logger.error('http_service.index: DELETE request: ', error, body)
        deferred.reject(error)
      } else {
        deferred.resolve(body)
      }
    })
    return deferred.promise
  }

  resolvePost (inputRequest, inputReqType, url, headers) {
    const deferred = q.defer()
    const options = {
      method: 'POST',
      url: url,
      timeout: this.timeInSeconds,
      headers: headers,
      [inputReqType]: inputRequest,
      json: true,
      rejectUnauthorized: false
    }
    request(options, (error, response, body) => {
      __logger.info('response from api ', error, response, body)
      if (error) {
        __logger.error('http_service.index: resolvePOST request: ', error, body)
        deferred.resolve({ err: true, error })
      } else {
        deferred.resolve(response)
      }
    })
    return deferred.promise
  }
}

module.exports = HttpRequest
