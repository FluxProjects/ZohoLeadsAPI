require('dotenv').config();
const axios = require('axios');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const DOMAIN = process.env.DOMAIN || 'com';

const code = process.argv[2];

if (!code) {
  console.error('\n❌ Error: Authorization code is required');
  console.log('Usage: node generate-refresh-token.js YOUR_AUTH_CODE\n');
  process.exit(1);
}

async function generateRefreshToken() {
  try {
    console.log('\n=== STEP 2: Generating Refresh Token ===\n');
    
    const response = await axios.post(
      `https://accounts.zoho.${DOMAIN}/oauth/v2/token`,
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          code: code
        }
      }
    );

    console.log('✅ Success! Your tokens:\n');
    console.log('Access Token:', response.data.access_token);
    console.log('Refresh Token:', response.data.refresh_token);
    console.log('\n📝 Update your .env file with:');
    console.log(`REFRESH_TOKEN=${response.data.refresh_token}\n`);
    
  } catch (error) {
    console.error('\n❌ Error generating refresh token:');
    console.error(error.response?.data || error.message);
    console.log('\nTip: Authorization codes expire quickly. Generate a new one if this fails.\n');
  }
}

generateRefreshToken();
