module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                compress: {
                    drop_console: false,
                }
            },
            directory_js: {
                files: {
                    '<%= pkg.jsMinDest %>/directory.min.js': [
                            '<%= pkg.jsRoot %>/dependencies/jquery-1.11.0.min.js',
                            '<%= pkg.jsRoot %>/dependencies/jquery.jclock.js',
                            '<%= pkg.jsRoot %>/dependencies/jquery.fancybox-1.3.1.js',
                            '<%= pkg.jsRoot %>/dependencies/jquery.scrollTo.min.js',
                            '<%= pkg.jsRoot %>/dependencies/heatmap.js',
                            '<%= pkg.jsRoot %>/std-lib.js',
                            '<%= pkg.jsRoot %>/pulse.js',
                            '<%= pkg.jsRoot %>/refreshTimer.js',
                            '<%= pkg.jsRoot %>/clock.js',
                            '<%= pkg.jsRoot %>/diagram.js',
                            '<%= pkg.jsRoot %>/directory.js',
                            '<%= pkg.jsRoot %>/heat-map.js',
                            '<%= pkg.jsRoot %>/floor-selector.js'
                    ],
                    '<%= pkg.jsMinDest %>/find-event.min.js': [
                        '<%= pkg.jsRoot %>/dependencies/handlebars.min-v1.3.0.js',
                        '<%= pkg.jsRoot %>/dependencies/moment.min.js',
                        '<%= pkg.jsRoot %>/pages/find-event.js',
                    ],
                    '<%= pkg.jsMinDest %>/pages.min.js': ['<%= pkg.jsRoot %>/pages/pages.js'],
                    '<%= pkg.jsMinDest %>/view-location.min.js': ['<%= pkg.jsRoot %>/pages/view-location.js'],
                    '<%= pkg.jsMinDest %>/home.min.js': ['<%= pkg.jsRoot %>/pages/home.js'],
                    '<%= pkg.jsMinDest %>/campus-map.min.js': ['<%= pkg.jsRoot %>/pages/campus-map/*.js']
                }
            },
        },
        sass: {
            directory_cmu: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= pkg.cssMinDest %>/cmu-base.min.css' : '<%= pkg.sassRoot %>/directory-cmu.scss',
                    '<%= pkg.cssMinDest %>/find-event.min.css' : '<%= pkg.sassRoot %>/pages/find-event.scss'
                }
            },
            directory_cmu_south: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= pkg.cssMinDest %>/cmu-south.min.css' : '<%= pkg.sassRoot %>/directory-cmu-south.scss',
                }
            },
            home_cmu_cube: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= pkg.cssMinDest %>/home-cmu-cube.min.css' : '<%= pkg.sassPages %>/home-cmu-cube.scss'
                }
            },
            home_cmu_north: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= pkg.cssMinDest %>/home-cmu-north.min.css' : '<%= pkg.sassPages %>/home-cmu-north.scss'
                }
            },
            home_cmu_south: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= pkg.cssMinDest %>/home-cmu-south.min.css' : '<%= pkg.sassPages %>/home-cmu-south.scss'
                }
            },
            home_spsc_south: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= pkg.cssMinDest %>/home-spsc-south.min.css' : '<%= pkg.sassPages %>/home-spsc-south.scss'
                }
            },
            directory_spsc: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= pkg.cssMinDest %>/spsc-base.min.css' : '<%= pkg.sassRoot %>/directory-spsc.scss'
                }
            },
            quick_find: {
                options : {
                    style: 'compressed'
                },
                files: {
                    '<%= pkg.cssMinDest %>/quick-find.min.css' : '<%= pkg.sassRoot %>/pages/quick-find.scss'
                }
            },
            by_floor: {
                options : {
                    style: 'compressed'
                },
                files: {
                    '<%= pkg.cssMinDest %>/by-floor.min.css' : '<%= pkg.sassRoot %>/pages/by-floor.scss'
                }
            },
            no_cursor: {
                options : {
                    style: 'compressed'
                },
                files: {
                    '<%= pkg.cssMinDest %>/no-cursor.min.css' : '<%= pkg.sassRoot %>/no-cursor.scss'
                }
            }
        },
        watch: {
            gruntfile: {
                files: [
                    'Gruntfile.js',
                    'static/js/directory.js',
                ],
            },
            css: {
                files: [
                    'static/sass/*.scss',
                    'static/sass/pages/*.scss',
                ],
                tasks: ['sass']
            },
            js: {
                files: [
                    'static/js/pulse.js',
                    'static/js/refreshTimer.js',
                    'static/js/clock.js',
                    'static/js/diagram.js',
                    'static/js/directory.js',
                    'static/js/floor-selector.js',
                    'static/js/history.js',
                    'static/js/pages/*.js',
                    'static/js/pages/campus-map/*.js'
                ],
                tasks: ['uglify']
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load the plugin that provides the "sass" task.
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Load watch plugin
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'sass', 'watch']);

};
