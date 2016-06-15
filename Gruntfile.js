module.exports = (function () {
  'use strict';
  return function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-bower-update');
    var config = {
      src: 'app'
    };
    grunt.initConfig({
      config: config,
      'gh-pages': {
        options: {
          base: 'www'
        },
        src: ['**']
      },
      jshint: {
        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        },
        gruntfile: 'Gruntfile.js',
        src: ['app/js/*.js']
      },
      copy: {
        libs: {
          files:[
          {
            cwd: 'bower_components/',
            nonull: true,
            flatten: true,
            expand: true,
            filter: 'isFile',
            src: ['/requirejs/require.js',
                  '/underscore/underscore-min.js',
                  '/DateJS/build/production/date.min.js'
                  ],
            dest: 'www/js/vendor/'
          }
          ]
        },
        galleria: {
          files:[
          {
            cwd: 'bower_components/galleria',
            src: ['**/*', '!galleria-1.4.2.js'],
            expand: true,
            dest: 'www/galleria'            
          }
          ]
        },
        foundation: {
          files:[
          {
            cwd: 'bower_components/',
            expand: true,
            nonull: true,
            flatten: true,
            filter: 'isFile',
            src: ['/foundation-sites/dist/foundation.min.js',
                  '/jquery/dist/jquery.min.js',
                  '/jquery-validation/dist/jquery.validate.min.js',
                  '/what-input/what-input.min.js'
                  ],
            dest: 'www/js/vendor/'
          },
          {
            cwd: 'bower_components/',
            expand: true,
            nonull: true,
            flatten: true,
            filter: 'isFile',
            src: ['/foundation-sites/dist/foundation.min.css',
                  ],
            dest: 'www/css/'
          }
          ]
        }
      }
    });
    grunt.registerTask('make', ['copy']);
    grunt.registerTask('publish', ['copy', 'gh-pages']);
  };
})();

// npm install -g bower grunt-cli
// bower install
// npm install -g cordova
