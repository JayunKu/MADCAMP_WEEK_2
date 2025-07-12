export default () => ({
  app: {
    env: process.env.APP_ENV,
    port: process.env.APP_PORT,
  },
  session: {
    url: process.env.SESSION_URL,
    key: process.env.SESSION_KEY,
  },
});
