const express = require('express');
const next = require('next');
const { loadEnvConfig } = require('@next/env');
const { EnvLoader } = require('@gu-corp/env-loader');
loadEnvConfig('./', process.env.NODE_ENV !== 'production');

const DEFAULT_REGION_AMAZON = 'ap-northeast-1';
const DEFAULT_ENV_PREFIX_ = 'USDTX_UI_';
const publicEnvKeys = [
  'NEXT_PUBLIC_JOC_URL',
  'NEXT_PUBLIC_ETH_MAINET_URL',
  'NEXT_PUBLIC_USDT_CONTRACT_ADDRESS',
  'NEXT_PUBLIC_USDTX_CONTRACT_ADDRESS',
];
const privateEnvKeys = [];

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const bootstrap = async () => {
  // Load environment to process.env
  const envLoader = new EnvLoader({
    dotenv: {},
    awsSsm: process.env.CLOUD_SERVICE_PROVIDER === 'aws' && {
      region: DEFAULT_REGION_AMAZON,
      accessKeyId: process.env.AWS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
    gcloudSecretManager: process.env.CLOUD_SERVICE_PROVIDER === 'gcloud' && {
      projectId: process.env.GOOGLE_CLOUD_PROJECT || '',
    },
  });
  await envLoader.load([...publicEnvKeys, ...privateEnvKeys], DEFAULT_ENV_PREFIX_);
  const publicEnvConfig = {};
  for (const key of publicEnvKeys) {
    publicEnvConfig[key] = process.env[key];
  }
  console.info('Public environment variables:');
  console.info(publicEnvConfig);

  // Serve express server
  await app.prepare();

  const server = express();
  server.get('/env.js', function (req, res) {
    res.send(`window.env = ${JSON.stringify(publicEnvConfig)}`);
  });
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
};
bootstrap();
