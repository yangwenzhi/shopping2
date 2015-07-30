({
    appDir: './public/js/app',
    baseUrl: '.',
    dir: './public/js/min',
    modules: [
        {
            name: 'index'
        },
        {
            name: 'detail'
        }
    ],
    fileExclusionRegExp: /^(r|build|require)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true
})