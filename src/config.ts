import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '7000', 10),
  aloRememberToken: process.env.ALO_REMEMBER_TOKEN || '',
  aloBaseUrl: process.env.ALO_BASE_URL || 'https://wellnessclub.aloyoga.com/api/v2',
  aloOrigin: 'https://wellnessclub.aloyoga.com',
};

if (!config.aloRememberToken) {
  console.warn(
    '[WARN] ALO_REMEMBER_TOKEN is not set in environment. Catalog browsing will work, but video streams will be locked.'
  );
}
