/*globals module, require */

module.exports = function (grunt) {
    "use strict";

    var currentBanner = "1010", // Banner, Type, Size, Code

        min = "0000", // Minium currentBanner values
        max = "3371", // Maximum currentBanner values

        path, // Holds string for file path (used for validation)

        fs = require('fs'); // Use Node.js's filesystem scripts (that Grunt natively uses as well)

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        devConfig: {
            build: {
                root: ['src/banner/'],
                partial: ['<%= devConfig.values.banner %>/<%= devConfig.values.type %>/<%= devConfig.values.size %>/'], // match to current page template you're working on from below
                stagingPath: ['stg/<%= devConfig.build.partial %>/<%= devConfig.values.code %>'],
                banner: {
                    '0': 'look_long_term',
                    '1': 'more_is_possible',
                    '2': 'power_of_three',
                    '3': 'think_sooner'
                },
                type: {
                    '0': 'dynamic',
                    '1': 'mobile',
                    '2': 'static',
                    '3': 'site_takeover'
                },
                size: {
                    '0': '120x600',
                    '1': '160x600',
                    '2': '300x250',
                    '3': '300x600',
                    '4': '468x60',
                    '5': '728x90',
                    '6': '300x50',
                    '7': '320x50'
                },
                code: {
                    '0': '_iTrack',
                    '1': '_zinc'
                }
            },
            // Config values to be compiled on call
            values: {
                banner: '<%= devConfig.build.banner[' + currentBanner[0] + '] %>',
                type: '<%= devConfig.build.type[' + currentBanner[1] + '] %>',
                size: '<%= devConfig.build.size[' + currentBanner[2] + '] %>',
                code: '<%= devConfig.build.code[' + currentBanner[3] + '] %>'
            }
        },
        // Watches files for changes and runs tasks based on the changed files
        watch: {
            assemble: {
                files: ["src/**/{,*/}*.{md,hbs,yml}"],
                tasks: ["assemble:dev"]
            },
            src: {
                files: ["src/**/*.scss", "src/**/*.js", "src/**/*.json", "src/**/*.html", "src/**/*.{gif,png,jpg,jpeg}", "src/**/*.{md,hbs,yml}"],
                tasks: ["build:development"],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['src/assets/sass/{,*/}*.{scss,sass}'],
                tasks: ['sass:dev']
            }
        },

        connect: {
            options: {
                port: 9000,
                livereload: true,
                open: true
            },
            development: {
                options: {
                    base: "tmp/"
                }
            }
        },

        // Task configuration.
        clean: {
            dev: {
                src: ['tmp/**']
            },
            staging: {
                src: ['stg/**']
            },
            dist: {
                src: ['<%= devConfig.build.stagingPath %>/*.js', '!<%= devConfig.build.stagingPath %>/app.js']
            }
        },

        assemble: {
            options: {
                assets: 'src',
                layout: ['src/layouts/default.hbs'],
                partials: ['src/partials/*.hbs'],
                data: ['src/data/data.json']
            },
            dev: {
                files: [
                    {
                        flatten: true,
                        src: ['<%= devConfig.build.root %><%= devConfig.build.partial %>/<%= devConfig.values.code %>/index.hbs'],
                        dest: 'tmp/index.html'
                    }
                ]
            },
            staging: {
                files: [
                    {
                        flatten: true,
                        src: ['<%= devConfig.build.root %><%= devConfig.build.partial %>/<%= devConfig.values.code %>/index.hbs'],
                        dest: '<%= devConfig.build.stagingPath %>/index.html'
                    }
                ]
            }
        },

        copy: {
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: "src/assets/js",
                        src: ["app.js", "polyfill.js", "stack_blur.js", "*<%= devConfig.values.banner %>*.js"],
                        dest: "tmp"
                    },
                    {
                        expand: true,
                        cwd: "<%= devConfig.build.root %><%= devConfig.build.partial %>",
                        src: ["*.{png,jpg,jpeg,gif,svg,js}"],
                        dest: "tmp"
                    },
                    {
                        expand: true,
                        cwd: "<%= devConfig.build.root %><%= devConfig.build.partial %>/<%= devConfig.values.code %>",
                        src: ["*.{jpg,jpeg}"],
                        rename: function (dest, src) {
                            return dest + "/static.jpg";
                        },
                        dest: "tmp"
                    }
                ]
            },

            staging_static: {
                files: [
                    {
                        expand: true,
                        cwd: "src/assets/js",
                        src: ["app.js", "polyfill.js"],
                        dest: "<%= devConfig.build.stagingPath %>/"
                    },
                    {
                        expand: true,
                        cwd: "<%= devConfig.build.root %><%= devConfig.build.partial %>",
                        src: ["*.{png,jpg,jpeg,gif,svg,js}"],
                        dest: "<%= devConfig.build.stagingPath %>/"
                    },
                    {
                        expand: true,
                        cwd: "<%= devConfig.build.root %><%= devConfig.build.partial %>/<%= devConfig.values.code %>",
                        src: ["*.{jpg,jpeg}"],
                        rename: function (dest, src) {
                            return dest + "/static.jpg";
                        },
                        dest: "<%= devConfig.build.stagingPath %>/"
                    }
                ]
            },

            staging_dynamic: {
                files: [
                    {
                        expand: true,
                        cwd: "src/assets/js",
                        src: ["app.js", "polyfill.js", "<%= devConfig.values.banner %>.js"],
                        dest: "<%= devConfig.build.stagingPath %>/"
                    },
                    {
                        expand: true,
                        cwd: "<%= devConfig.build.root %><%= devConfig.build.partial %>",
                        src: ["*.{png,jpg,jpeg,gif,svg,js}"],
                        dest: "<%= devConfig.build.stagingPath %>/"
                    },
                    {
                        expand: true,
                        cwd: "<%= devConfig.build.root %><%= devConfig.build.partial %>/<%= devConfig.values.code %>",
                        src: ["*.{jpg,jpeg}"],
                        rename: function (dest, src) {
                            return dest + "/static.jpg";
                        },
                        dest: "<%= devConfig.build.stagingPath %>/"
                    }
                ]
            },

            staging_more_is_possible: {
                files: [
                    {
                        expand: true,
                        cwd: "src/assets/js",
                        src: ["app.js", "polyfill.js", "stack_blur.js", "<%= devConfig.values.banner %>.js"],
                        dest: "<%= devConfig.build.stagingPath %>/"
                    },
                    {
                        expand: true,
                        cwd: "<%= devConfig.build.root %><%= devConfig.build.partial %>",
                        src: ["*.{png,jpg,jpeg,gif,svg,js}"],
                        dest: "<%= devConfig.build.stagingPath %>/"
                    },
                    {
                        expand: true,
                        cwd: "<%= devConfig.build.root %><%= devConfig.build.partial %>/<%= devConfig.values.code %>",
                        src: ["*.{jpg,jpeg}"],
                        rename: function (dest, src) {
                            return dest + "/static.jpg";
                        },
                        dest: "<%= devConfig.build.stagingPath %>/"
                    }
                ]
            },

            staging_site_takeover: {
                files: [
                    {
                        expand: true,
                        cwd: "src/assets/js",
                        src: ["app.js", "polyfill.js", "<%= devConfig.values.banner %>_<%= devConfig.values.type %>.js"],
                        dest: "<%= devConfig.build.stagingPath %>/"
                    },
                    {
                        expand: true,
                        cwd: "<%= devConfig.build.root %><%= devConfig.build.partial %>",
                        src: ["*.{png,jpg,jpeg,gif,svg,js}"],
                        dest: "<%= devConfig.build.stagingPath %>/"
                    },
                    {
                        expand: true,
                        cwd: "<%= devConfig.build.root %><%= devConfig.build.partial %>/<%= devConfig.values.code %>",
                        src: ["*.{jpg,jpeg}"],
                        rename: function (dest, src) {
                            return dest + "/static.jpg";
                        },
                        dest: "<%= devConfig.build.stagingPath %>/"
                    }
                ]
            },

            staging_template: {
                files: [
                    {
                        expand: true,
                        cwd: "staging_template",
                        src: ["**"],
                        dest: "stg"
                    }
                ]
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                loadPath: 'bower_components',
                sourcemap: 'none'
            },
            dev: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/sass',
                    src: ['*.{scss,sass}'],
                    ext: '.css',
                    dest: 'tmp'
                }]
            },
            staging: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/sass',
                    src: ['*.{scss,sass}'],
                    ext: '.css',
                    dest: '<%= devConfig.build.stagingPath %>/'
                }]
            }
        },

        cssmin: {
            core: {
                files: [{
                    expand: true,
                    cwd: '<%= devConfig.build.stagingPath %>/',
                    src: ['*.css'],
                    ext: '.css',
                    dest: '<%= devConfig.build.stagingPath %>/'
                }]
            }
        },

        concat: {
            core: {
                options: {
                    // define a string to put between each file in the concatenated output
                    //separator: ';'
                },
                files: [{
                    src: ['<%= devConfig.build.stagingPath %>/*.js'],
                    dest: '<%= devConfig.build.stagingPath %>/app.js'
                }]
            }
        },

        uglify: {
            core: {
                options: {
                    mangle: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= devConfig.build.stagingPath %>/',
                    src: ['*.js'],
                    ext: '.js',
                    dest: '<%= devConfig.build.stagingPath %>/'
                }]
            }
        },

        imagemin: { // Task
            core: {
                options: { // Target options
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: '<%= devConfig.build.stagingPath %>/',
                    src: ['*.{png,jpg}'],
                    dest: '<%= devConfig.build.stagingPath %>/'
                }]
            }
        },
        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= devConfig.build.stagingPath %>/index.html',
            options: {
                root: '<%= devConfig.build.stagingPath %>/',
                dest: '<%= devConfig.build.stagingPath %>/'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: [
                    '<%= devConfig.build.stagingPath %>/'
                ]
            },
            html: ['<%= devConfig.build.stagingPath %>/*.html'],
            css: ['<%= devConfig.build.stagingPath %>/*.css'],
            js: ['<%= devConfig.build.stagingPath %>/*.js']
        },
        htmlmin: {
            core: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: false,
                    removeOptionalTags: false,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeComments: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= devConfig.build.stagingPath %>/',
                    src: '{,*/}*.html',
                    dest: '<%= devConfig.build.stagingPath %>/'
                }]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-assemble');
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-lint-pattern");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks('grunt-run');

    grunt.registerTask("importSCSS", "Changes imports based upon selected banner", function () {

        var currentGlobal = grunt.config.get('devConfig.values.banner'),
            currentSize = grunt.config.get('devConfig.values.size'),
            type = grunt.config.get('devConfig.values.type');

        if (type != 'static' && type != 'mobile') {
            grunt.file.write("src/assets/sass/_template.scss",
                "@import \"" + currentGlobal + "/" + currentGlobal + "_global" + "\";\n"); //+
                //"@import \"" + currentGlobal + "/" + currentSize + "\";");
        } else {
            grunt.file.write("src/assets/sass/_template.scss", "");
        }
    });

    grunt.registerTask("server", "Compiles the development environment", [
        "build:development",
        "connect:development",
        "watch"
    ]);

    grunt.registerTask("build:development", "Compiles the development build", [
        "importSCSS",
        "clean:dev",
        "assemble:dev",
        "copy:dev",
        "sass:dev"
    ]);

    grunt.registerTask("build:staging", "Compiles the staging build", function (cb) {
        if (cb) {
            // Assign combination
            currentBanner = cb;

            // Compile values
            compileConfigValues();
        }

        // Run tasks
        grunt.task.run([
            "importSCSS",
            "assemble:staging"
        ]);

        var banner = grunt.config.get('devConfig.values.banner'),
            type = grunt.config.get('devConfig.values.type');

        if (type == "static" || type == "mobile") {
            grunt.task.run("copy:staging_static");
        } else if (type == "site_takeover") {
            grunt.task.run("copy:staging_site_takeover");
        } else {
            if (banner == "more_is_possible") {
                grunt.task.run("copy:staging_more_is_possible");
            } else {
                grunt.task.run("copy:staging_dynamic");
            }
        }

        grunt.task.run([
            "sass:staging",
            //"useminPrepare",
            //"concat:generated",
            //"cssmin:generated",
            //"uglify:generated",
            "usemin",
            "concat",
            "clean:dist",
            "cssmin",
            "uglify",
            //"imagemin",
            "htmlmin"
        ]);
    });

    // Because Grunt executes tasks enqueue after all other javascript is finished executing,
    // Each Config variable must be recompiled so that it may pass on altered values in subsequent tasks as intended
    // Otherwise, Grunt would interpret currentBanner only once when initially compiling the Config values,
    // and then use that value for all tasks
    function compileConfigValues(rpath) {
        grunt.config.set('devConfig.values.banner', '<%= devConfig.build.banner[' + currentBanner[0] + '] %>');
        grunt.config.set('devConfig.values.type', '<%= devConfig.build.type[' + currentBanner[1] + '] %>');
        grunt.config.set('devConfig.values.size', '<%= devConfig.build.size[' + currentBanner[2] + '] %>');
        grunt.config.set('devConfig.values.code', '<%= devConfig.build.code[' + currentBanner[3] + '] %>');

        if (rpath) {
            return "./" +
                grunt.config.get('devConfig.build.root') +
                grunt.config.get('devConfig.values.banner') + "/" +
                grunt.config.get('devConfig.values.type') + "/" +
                grunt.config.get('devConfig.values.size') + "/" +
                grunt.config.get('devConfig.values.code');
        }
    }

    function validatePath(path) {
        // Validate file path
        try {
            // If directory not found, throws an error and does not excute any further code
            fs.accessSync(path);

            return true;
        } catch (e) {
            return false;
        }
    }

    grunt.registerTask('build:allstaging', 'Builds all banners to staging', function () {

        // Dont try anything unless computed values match
        if (currentBanner.length !== max.length || currentBanner.length !== min.length) {
            return;
        }

        // Clean the staging folder
        grunt.task.run("clean:staging");

        // Get the staging index.html
        grunt.task.run("copy:staging_template");

        //grunt.option('force', true); // Use the force option for all tasks declared in the previous line

        var a,
            b,
            c,
            d;

        // Loop through all banner combinations
        for (a = Number(min[0]); a <= Number(max[0]); a += 1) {
            for (b = Number(min[1]); b <= Number(max[1]); b += 1) {
                for (c = Number(min[2]); c <= Number(max[2]); c += 1) {
                    for (d = Number(min[3]); d <= Number(max[3]); d += 1) {

                        // Build banner string
                        currentBanner = "" + a + b + c + d;

                        // Compile values, build and return file path
                        path = compileConfigValues(true);

                        //grunt.log.writeln(path);
                        //grunt.log.writeln(validatePath(path));

                        // If the path exists in the current file structure
                        if (validatePath(path)) {

                            // Build the banner
                            // (Grunt tasks run enqueue after loop is complete)
                            grunt.task.run("build:staging:" + currentBanner); // run with function parameter
                        }

                    }
                }
            }
        }

    });

};