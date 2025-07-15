export default () => ({
  app: {
    env: process.env.APP_ENV,
    port: process.env.APP_PORT,
  },
  redis: {
    url: process.env.INMEMORY_DB_URL,
  },
  session: {
    url: process.env.SESSION_DB_URL,
    key: process.env.SESSION_KEY,
  },
  image_gen_api: {
    url: process.env.IMAGE_GEN_API_URL,
  },
});
