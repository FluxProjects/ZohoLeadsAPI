require('dotenv').config();

// Required SDK imports — must match exactly how this version exports them
const UserSignature = require( "@zohocrm/nodejs-sdk-2.0/routes/user_signature").UserSignature;
const OAuthBuilder = require("@zohocrm/nodejs-sdk-2.0/models/authenticator/oauth_builder").OAuthBuilder;
const InitializeBuilder = require("@zohocrm/nodejs-sdk-2.0/routes/initialize_builder").InitializeBuilder;
const USDataCenter = require("@zohocrm/nodejs-sdk-2.0/routes/dc/us_data_center").USDataCenter;
const EUDataCenter = require("@zohocrm/nodejs-sdk-2.0/routes/dc/eu_data_center").EUDataCenter;
const INDataCenter = require("@zohocrm/nodejs-sdk-2.0/routes/dc/in_data_center").INDataCenter;
const CNDataCenter = require("@zohocrm/nodejs-sdk-2.0/routes/dc/cn_data_center").CNDataCenter;
const Levels = require("@zohocrm/nodejs-sdk-2.0/routes/logger/logger").Levels;
const LogBuilder = require("@zohocrm/nodejs-sdk-2.0/routes/logger/log_builder").LogBuilder;
const AUDataCenter = require("@zohocrm/nodejs-sdk-2.0/routes/dc/au_data_center").AUDataCenter;
const SDKConfigBuilder = require("@zohocrm/nodejs-sdk-2.0/routes/sdk_config_builder").SDKConfigBuilder;

// Map domain -> environment builder
const domainMap = {
  com: USDataCenter,
  eu: EUDataCenter,
  in: INDataCenter,
  'com.cn': CNDataCenter,
  'com.au': AUDataCenter
};

async function initializeZohoSDK() {
  try {

    let logger = new LogBuilder()
        .level(Levels.INFO)
        .filePath("/Users/user_name/Documents/node_sdk_log.log")
        .build();

    // 1️⃣ User (required)
    const user = new UserSignature(process.env.USER_EMAIL);

    // 2️⃣ Environment (domain + production)
    const domainKey = process.env.DOMAIN || 'com';
    const DataCenter = domainMap[domainKey];
    if (!DataCenter) throw new Error(`Unknown domain "${domainKey}". Use one of: ${Object.keys(domainMap).join(', ')}`);
    const environment = DataCenter.PRODUCTION();

    // 3️⃣ Token (OAuth refresh token)
    const token = new OAuthBuilder()
      .clientId(process.env.CLIENT_ID)
      .clientSecret(process.env.CLIENT_SECRET)
      .refreshToken(process.env.REFRESH_TOKEN)
      .redirectURL(process.env.REDIRECT_URI)
      .build();

    // 4️⃣ SDK configuration (optional)
    const sdkConfig = new SDKConfigBuilder()
      .autoRefreshFields(true)
      .pickListValidation(true)
      .build();

    // 5️⃣ Initialize
    try {
            (await new InitializeBuilder())
                .user(user)
                .environment(environment)
                .token(token)
                .SDKConfig(sdkConfig)
                .logger(logger)
                .initialize();
        } catch (error) {
            console.log(error);
        }

    console.log("✅ Zoho SDK Initialized Successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Zoho SDK:", error);
  }
}

module.exports = { initializeZohoSDK };
