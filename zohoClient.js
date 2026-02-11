const { OAuthBuilder, Initializer, USDataCenter, EUDataCenter, INDataCenter, CNDataCenter, AUDataCenter } = require('@zohocrm/nodejs-sdk-2.0/models/authenticator/oauth_token');
const { LogBuilder, Levels } = require('@zohocrm/nodejs-sdk-2.0/routes/logger/logger');
const { SDKConfigBuilder } = require('@zohocrm/nodejs-sdk-2.0/routes/sdk_config');
const path = require('path');

const domainMap = {
  'com': USDataCenter,
  'eu': EUDataCenter,
  'in': INDataCenter,
  'com.cn': CNDataCenter,
  'com.au': AUDataCenter
};

async function initializeZohoSDK() {
  const environment = process.env.ENVIRONMENT || 'PRODUCTION';
  const domain = process.env.DOMAIN || 'com';
  
  const token = new OAuthBuilder()
    .clientId(process.env.CLIENT_ID)
    .clientSecret(process.env.CLIENT_SECRET)
    .refreshToken(process.env.REFRESH_TOKEN)
    .redirectURL(process.env.REDIRECT_URI)
    .build();

  const DataCenter = domainMap[domain] || USDataCenter;
  const env = DataCenter[environment]();

  const logger = new LogBuilder()
    .level(Levels.INFO)
    .filePath(path.join(__dirname, 'logs'))
    .build();

  const sdkConfig = new SDKConfigBuilder()
    .autoRefreshFields(false)
    .pickListValidation(true)
    .build();

  await new Initializer()
    .token(token)
    .environment(env)
    .logger(logger)
    .SDKConfig(sdkConfig)
    .initialize();
}

module.exports = { initializeZohoSDK };
