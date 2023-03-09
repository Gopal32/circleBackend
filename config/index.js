const __constants = require('./constants')
const appName = __constants.APP_NAME
const dbName = __constants.DB_NAME

module.exports = {
  env: process.env.NODE_ENV,
  app_name: appName,
  api_prefix: appName,
  port: process.env.PORT,
  base_url: process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:' + process.env.PORT,
  authConfig: {
    apiAuthAlias: process.env.AUTH_CONFIG_API_AUTH_ALIAS,
    secretKey: process.env.AUTH_CONFIG_SECRET_KEY,
    cipherAlgorithm: process.env.AUTH_CONFIG_CIPHER_ALGORITHM,
    inactiveTimeFrame: +process.env.AUTH_CONFIG_API_AUTH_INACTIVE_TIME_FRAME,
    forceExpireTimeFrame: +process.env.AUTH_CONFIG_API_AUTH_FORCE_EXPIREY_TIME_FRAME,
    apiAccessKey: process.env.AUTH_CONFIG_API_AUTH_API_ACCESS_KEY,
    serverDocAccessKey: process.env.AUTH_CONFIG_API_AUTH_SERVER_DOC_ACCESS_KEY
  },
  logging: {
    log_file: process.env.LOGGING_LOG_PATH + '/' + appName,
    console: process.env.LOGGING_CONSOLE === 'true',
    only_console: process.env.LOGGING_ONLY_CONSOLE === 'true',
    level: process.env.LOGGING_LEVEL,
    datePattern: process.env.LOGGING_DATE_PATTERN,
    maxsize: +process.env.LOGGING_MAX_SIZE,
    colorize: process.env.LOGGING_COLORIZE === 'true',
    mongo: {
      host: process.env.LOGGING_MONGO_HOST,
      db: dbName + 'Logs',
      port: +process.env.LOGGING_MONGO_PORT,
      username: process.env.LOGGING_MONGO_USER_NAME,
      password: process.env.LOGGING_MONGO_PASSWORD,
      enabled: process.env.LOGGING_MONGO_ENABLED
    },
    log_path: process.env.LOGGING_LOG_PATH
  },
  //  aws: {
  //     apiVersion: process.env.AWS_API_VERSION,
  //     region: process.env.AWS_REGION,
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  //   },
  //   aws_s3: {
  //     bucket_config: {
  //       bucketName: process.env.AWS_S3_BUCKET_CONFIG_NAME,
  //       apiVersion: process.env.AWS_S3_BUCKET_CONFIG_API_VERSION,
  //       region: process.env.AWS_S3_BUCKET_CONFIG__REGION,
  //       accessKeyId: process.env.AWS_S3_BUCKET_CONFIG_ACCESS_KEY_ID,
  //       secretAccessKey: process.env.AWS_S3_BUCKET_CONFIG_SECRET_ACCESS_KEY
  //     }
  //   },
  //   app_settings: {
  //     file_upload: {
  //       default_path: process.env.APP_SETTINGS_FILE_UPLOAD_DEFAULT_PATH,
  //       json_upload_path: process.env.APP_SETTINGS_FILE_UPLOAD_JSON_PATH,
  //       max_file_size: 500 * 1024 * 1024, // bytes*kbs*mbs,
  //       min_file_size: 50 * 1024 * 1024 // bytes*kbs*mbs
  //     }
  //   },
  test: {
    init: process.env.HW_MYSQL_INIT === 'true',
    name: __constants.HW_MYSQL_NAME,
    is_slave: process.env.HW_MYSQL_IS_SLAVE === 'true',
    options: {
      connection_limit: +process.env.HW_MYSQL_OPTIONS_CONNECTION_LIMIT,
      host: process.env.HW_MYSQL_OPTIONS_HOST,
      user: process.env.HW_MYSQL_OPTIONS_USER,
      password: process.env.HW_MYSQL_OPTIONS_PASSWORD,
      database: process.env.HW_MYSQL_OPTIONS_DATABASE,
      acquireTimeout: 0,
      port: +process.env.HW_MYSQL_OPTIONS_PORT,
      timezone: 'utc'
    }
  },
  redis_local: {
    init: process.env.REDIS_INIT === 'true',
    host: process.env.REDIS_HOST,
    no_ready_check: process.env.REDIS_NO_READY_CHECK === 'true',
    auth_pass: process.env.REDIS_AUTH_PASS,
    port: process.env.REDIS_PORT,
    uri: 'redis://' + process.env.REDIS_HOST + ':' + process.env.REDIS_PORT + '/' + process.env.REDIS_DB // not used
  },
  authentication: {
    jwtSecretKey: process.env.AUTHENTICATION_JWT_SECRET_KEY,
    google: {
      allow: process.env.AUTHENTICATION_GOOGLE_ALLOW === 'true',
      clientID: process.env.AUTHENTICATION_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTHENTICATION_GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.AUTHENTICATION_GOOGLE_CALLBACK_URL,
      authorizationURL: process.env.AUTHENTICATION_GOOGLE_AUTHORIZATION_URL,
      tokenURL: process.env.AUTHENTICATION_GOOGLE_TOKEN_URL
    },
    // facebook: {
    //   allow: process.env.AUTHENTICATION_FACEBOOK_ALLOW === 'true',
    //   clientID: process.env.AUTHENTICATION_FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.AUTHENTICATION_FACEBOOK_CLIENT_SECRET,
    //   callbackURL: process.env.AUTHENTICATION_FACEBOOK_CALLBACK_URL,
    //   profileFields: process.env.AUTHENTICATION_FACEBOOK_PROFILE_FIELDS.split(','),
    //   authorizationURL: process.env.AUTHENTICATION_FACEBOOK_AUTHORIZATION_URL,
    //   tokenURL: process.env.AUTHENTICATION_FACEBOOK_TOKEN_URL,
    //   scopeSeparator: ','
    // },
    internal: {
      allow: process.env.AUTHENTICATION_INTERNAL_ALLOW === 'true'
    },
    strategy: {
      // google: {
      //   name: 'google',
      //   options: {
      //     scope: process.env.AUTHENTICATION_STRATEGY_GOOGLE_OPTIONS_SCOPE.split(',')
      //   }
      // },
      // facebook: {
      //   name: 'facebook',
      //   options: {
      //     scope: process.env.AUTHENTICATION_STRATEGY_FACEBOOK_OPTIONS_SCOPE
      //   }
      // },
      jwt: {
        name: 'jwt',
        options: {
          session: process.env.AUTHENTICATION_STRATEGY_GOOGLE_OPTIONS_SESSION === 'true'
        }
      }
    }
  },
  emailProvider: {
    sendEmail: process.env.EMAIL_PROVIDER_SEND_EMAIL === 'true',
    service: process.env.EMAIL_PROVIDER_SERVICE,
    host: process.env.EMAIL_PROVIDER_HOST,
    port: +process.env.EMAIL_PROVIDER_PORT,
    auth: {
      user: process.env.EMAIL_PROVIDER_AUTH_USER,
      password: process.env.EMAIL_PROVIDER_AUTH_PASSWORD
    },
    tls: process.env.EMAIL_PROVIDER_TLS === 'true',
    debug: process.env.EMAIL_PROVIDER_DEBUG === 'true',
    fromEmail: process.env.EMAIL_PROVIDER_FROM_EMAIL,
    subject: {
      emailVerification: process.env.EMAIL_PROVIDER_SUBJECT_EMAIL_VERIFICATION,
      passwordReset: process.env.EMAIL_PROVIDER_SUBJECT_PASSWORD_RESET,
      templateStatusSubject: process.env.EMAIL_TEMPLATE_STATUS_SUBJECT
    }
  },
  swaggerUrl: {
    platform: process.env.BASE_URL ? process.env.BASE_URL + '/' + __constants.APP_NAME + '/api' : 'http://localhost:' + process.env.PORT + '/' + __constants.APP_NAME + '/api'
  },
  photoUrl: process.env.PHOTO_URL,
  categoryUrl: process.env.CATEGORY_URL,
  newsUrl: process.env.NEWS_URL
}
