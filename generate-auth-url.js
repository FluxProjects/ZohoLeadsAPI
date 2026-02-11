require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const DOMAIN = process.env.DOMAIN || 'com';

const authUrl = `https://accounts.zoho.${DOMAIN}/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}`;

console.log('\n=== STEP 1: Generate Authorization Code ===\n');
console.log('1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Authorize the application');
console.log('3. Copy the "code" parameter from the redirect URL');
console.log('4. Run: node generate-refresh-token.js YOUR_CODE\n');
