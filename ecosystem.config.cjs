module.exports = {
    apps: [{
        name: 'richards-space',
        cwd: __dirname,
        script: './server.js',
        instances: 1,
        exec_mode: 'fork',
        watch: false,
        env: { NODE_ENV: 'production' }
    }]
};
