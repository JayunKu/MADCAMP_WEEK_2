export default () => ({
  app: {
    env: process.env.APP_ENV,
    port: process.env.APP_PORT,
  },
  in_memory_db: {
    url: process.env.IN_MEMORY_DB_URL,
  },
  session: {
    url: process.env.SESSION_DB_URL,
    key: process.env.SESSION_KEY,
  },
});
