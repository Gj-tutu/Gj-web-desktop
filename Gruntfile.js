module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    require('time-grunt')(grunt);

    var webpack = require('webpack');

    grunt.initConfig({
        //less
        less: {
            default: {
                src: ['web/source/css/index.less'],
                dest: 'web/static/css/index.css'
            }
        },
        //css压缩
        cssmin: {
            default: {
                src: ['web/static/css/index.css'],
                dest: 'web/static/css/index.min.css'
            }
        },
        //webpack 资源打包
        webpack:{
            default: {
                entry: "./web/source/js/index",
                output: {
                    path: "./web/static/js/",
                    filename: "index.js"
                },
                module: {
                    loaders: [{test: /\.js(x)?$/,loader: 'jsx-loader'}]
                },
                plugins: [
                    new webpack.ProvidePlugin({
                        R: "React",
                        EChart: "echarts"
                    })
                ],
                externals: {
                    React: 'React',
                    echarts: 'echarts'
                }
            }
        }
    });

    grunt.registerTask('css', ['less','cssmin']);

    grunt.registerTask('init', ['webpack','css']);
};

