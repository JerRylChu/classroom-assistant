module.exports = {
    devServer:{
        port: 8081,
        host: 'localhost',
        https: false,
        open: true,

        proxy: {
            '/dev-api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/dev-api': '',
                }
            }
        }
    },
    lintOnSave: false,
};
