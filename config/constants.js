const APP_NAME = 'demo'
const DB_NAME = 'helowhatsapp'
const HW_MYSQL_NAME = 'test'
const CUSTOM_CONSTANT = {
  UPLOAD_ERROR_MSG: {
    LIMIT_FILE_SIZE: 'LIMIT_FILE_SIZE'
    // WRONG_EXTENSION: 'WRONG_EXTENSION',
    // UPLOAD_DIRECTORY_MISSING: 'UPLOAD_DIRECTORY_MISSING'
  },
  SESSION_TIME: 691200, // 8 days
  EXIRES_TIME: 604800 // 1 week
}

const SUBSCRIPTION = {
  free_plan: '3e1ae2fb-454b-4bb4-a9dd-dcdef2a40d73',
  basic: 'f717a43a-826c-48a2-9a60-649c298cef09',
  silver: 'c43bf5aa-00ac-4f8b-b254-af89db812201',
  gold: '23819692-a71a-4b41-b7e9-06d07392907d'
}

const VERIFICATION_CHANNEL = {
  email: { name: 'email', expiresIn: 300, codeLength: 4 }
}
const PUBLIC_FOLDER_PATH = process.env.PWD + '/public'
const SERVER_TIMEOUT = 2 * 60 * 1000
const VALIDATOR = {
  fullName: '^[a-z]*( [a-z]*)+$',
  // email: '^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
  password: '^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$',
  username: '^[A-Za-z][A-Za-z0-9@#$&_-]{7,29}$',
  // text: '^[a-zA-Z]+$',
  // textWithSpace: '^[a-zA-Z\t\\s]*$',
  number: '^[0-9]+$'
  // alphanumericWithSpace: '^[a-zA-Z0-9\t\\s]*$',
  // alphanumericWithSpecialChar: '^[a-zA-Z0-9\t\\s-@,_&()]*$',
  // alphanumericWithMinSpecialChar: '^[a-zA-Z0-9\t\\s-()]*$',
  // alphaNumeric: '^[a-zA-Z0-9]+$',
  // phoneNumber: '^\\d{1,15}$',
  // // phoneNumberWithPhoneCode: '^[\\d+]{1,4}\\s?[0-9]{15}$',
  // phoneNumberWithPhoneCode: '^[0-9]{6,15}$',
  // postalCode: '^\\d{1,6}$',
  // phoneCode: '^\\d{1,2}$',
  // timeStamp: '^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$',
  // timeStampForDownload: '^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]Z$',
  // timeStampSummary: '^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T(2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9].[0-9][0-9][0-9]Z$',
  // alphaNumericWithUnderscore: '^[a-z0-9_]+$',
  // fileExtType: /^(jpg|jpeg|png)$/,
  // url: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
  // gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  // pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i,
  // noTabLinebreakSpace: /^(?:(.)(?!\s\s\s\s)(?!\n)(?!\t))*$/g,
  // empty: /^''$/g,
  // dateFormat: /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/g,
  // payload: /^[0-2]{1}/g
}
const FILE_MAX_UPLOAD_IN_BYTE = 5000000
// const MIMETYPE = {
//   png: 'image/png',
//   jpeg: 'image/jpeg',
//   jpg: 'image/jpg',
//   mp4: 'video/mp4',
//   pdf: 'application/pdf'

// }
// const FB_HEADER_TO_VIVA_HEADER = {
//   video: 'Video',
//   document: 'Document',
//   location: 'Location',
//   text: 'Text',
//   image: 'Image'
// }
const REDIS_KEY = {
  EMAIL_OTP_KEY: 'OTP_',
  USER_DETAILS: 'USER_DETAILS_',
  PLAN: 'PLAN_'
}
const PROVIDER_TYPE = {
  email: 'email'
}

module.exports.RESPONSE_MESSAGES = require('./status-response')
module.exports.CUSTOM_CONSTANT = CUSTOM_CONSTANT
module.exports.VERIFICATION_CHANNEL = VERIFICATION_CHANNEL
module.exports.PUBLIC_FOLDER_PATH = PUBLIC_FOLDER_PATH
module.exports.APP_NAME = APP_NAME
module.exports.DB_NAME = DB_NAME
module.exports.SERVER_TIMEOUT = SERVER_TIMEOUT
module.exports.HW_MYSQL_NAME = HW_MYSQL_NAME
module.exports.VALIDATOR = VALIDATOR
module.exports.FILE_MAX_UPLOAD_IN_BYTE = FILE_MAX_UPLOAD_IN_BYTE
module.exports.REDIS_KEY = REDIS_KEY
module.exports.PROVIDER_TYPE = PROVIDER_TYPE
module.exports.SUBSCRIPTION = SUBSCRIPTION
