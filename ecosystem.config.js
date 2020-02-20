module.exports = {
  apps : [
    {
      name: 'init',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '512M',
      env: {
        SERVICE_NAME: 'init-service',
        NODE_ENV: 'development',
        PORT: 3000
      }
    },
    {
      name: 'service1',
      script: 'service1.js',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '512M',
      env: {
        SERVICE_NAME: 'service1',
        NODE_ENV: 'development',
        PORT: 3001
      }
    },
    {
      name: 'service2',
      script: 'service2.js',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '512M',
      env: {
        SERVICE_NAME: 'service2',
        NODE_ENV: 'development',
        PORT: 3002
      }
    },
    {
      name: 'service3',
      script: 'service3.js',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '512M',
      env: {
        SERVICE_NAME: 'service3',
        NODE_ENV: 'development',
        PORT: 3003
      }
    },
    {
      name: 'service4',
      script: 'service4.js',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '512M',
      env: {
        SERVICE_NAME: 'service4',
        NODE_ENV: 'development',
        PORT: 3004
      }
    },
    {
      name: 'service5',
      script: 'service5.js',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '512M',
      env: {
        SERVICE_NAME: 'service5',
        NODE_ENV: 'development',
        PORT: 3005
      }
    }
]
};
