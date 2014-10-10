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
<<<<<<< HEAD
};
=======
};

//updata two  duanqifeng
>>>>>>> a24991cc3c30e3b100522acfce6ab9494a5f2a5e
