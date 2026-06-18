/** PM2 config — run: cd /var/www/metalmymini && pm2 start ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: "metalmymini",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3009",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
