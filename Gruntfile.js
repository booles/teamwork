module.exports = function (grunt) {
 
    grunt.loadNpmTasks('grunt-nodemon');


    grunt.initConfig({
        nodemon: {
            dev: {
                script: 'app.js'
            }
        }
    });

    grunt.registerTask('default', ['nodemon']);     
};

//
//第二次提交