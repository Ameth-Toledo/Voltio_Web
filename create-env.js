const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, 'src', 'environments');
const envFile = path.join(envDir, 'environment.ts');

if (!fs.existsSync(envDir)) {
    fs.mkdirSync(envDir, { recursive: true });
}

const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
const apiUrl = process.env.API_URL || 'http://localhost:8080';

const envContent = `export const environment = {
  production: ${isProduction},
  apiUrl: '${apiUrl}'
};
`;

fs.writeFileSync(envFile, envContent);
console.log('   Environment file created successfully');
console.log(`   Production: ${isProduction}`);
console.log(`   API URL: ${apiUrl}`);