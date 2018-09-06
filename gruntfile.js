module.exports = function(grunt) {
    grunt.initConfig({

        concat : {
            dist : {
                src: ['src/components/scripts/*.js'],
                dest: 'src/builds/development/js/script.js'
            }
        }

    }); // initConfig

    grunt.loadNpmTasks('grunt-contrib-concat');
};