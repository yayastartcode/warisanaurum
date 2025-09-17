module.exports = {
  apps: [
    {
      name: 'warisan-backend',
      script: './backend/dist/index.js',
      cwd: '/var/www/warisan',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ],
  
  deploy: {
    production: {
      user: 'root',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'https://github.com/your-username/warisan.git',
      path: '/var/www/warisan',
      'post-deploy': 'cd backend && npm install --production && npm run build && pm2 reload ecosystem.config.js --env production && pm2 save'
    }
  }
};