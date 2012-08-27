/*global module:false*/
module.exports = function(grunt) {

	grunt.loadNpmTasks("grunt-coffee");

	// Project configuration.
	grunt.initConfig({

		pkg: "<json:package.json>",

		meta: {
			banner: "/*\n" +
					"* <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today('yyyy-mm-dd') %> - <%= pkg.homepage %>\n" +
					"* by <%= pkg.author %>\n" +
					"*\n" +
					"* Licensed under:\n" +
					"*    <%= _.map(pkg.licenses, function(license){ return license.type + ' - ' + license.url; }).join('\n*    ') %>\n" +
					"*/"
		},

		coffee: {
			build: {
				src: ["src/*.coffee"],
				dest: "build/tmp"/*,
				options: {
					bare: false
				}*/
			}
		},

		concat: {
			build: {
				src: [
					"<banner>",
					"src/build/scope_start.js",
						"build/tmp/AOP.js",
						"build/tmp/Nori.js",
					"src/build/scope_end.js"
				],
				dest: "build/nori.js"
			}
		},

		min: {
			build: {
				src: ["<banner>", "build/nori.js"],
				dest: "build/nori.min.js"
			}
		},

		watch: {
			files: "src/*.coffee",
			tasks: "default"
		}

	});

	// Default task.
	grunt.registerTask("default", "coffee concat min");

};
