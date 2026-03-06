module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_COOKIE_EXPIRE: 7,
};
