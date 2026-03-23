const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, 'src', 'environments');
const envFile = path.join(envDir, 'environment.ts');

if (!fs.existsSync(envDir)) {
    fs.mkdirSync(envDir, { recursive: true });
}

const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
const apiUrl = process.env.API_URL || 'http://localhost:8080';
const paypalClientId = process.env.PAYPAL_CLIENT_ID || '';
const paypalCurrency = process.env.PAYPAL_CURRENCY || 'MXN';
const paypalMode = process.env.PAYPAL_MODE || 'sandbox';

const envContent = `export const environment = {
  production: ${isProduction},
  apiUrl: '${apiUrl}',
  paypal: {
    clientId: '${paypalClientId}',
    currency: '${paypalCurrency}',
    mode: '${paypalMode}'
  }
};
`;

fs.writeFileSync(envFile, envContent);
console.log('   Environment file created successfully');
console.log(`   Production: ${isProduction}`);
console.log(`   API URL: ${apiUrl}`);
console.log(`   PayPal mode: ${paypalMode}`);