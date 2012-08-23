/*global module:false*/
module.exports = function(grunt) {

	grunt.loadNpmTasks("grunt-coffee");

	// Project configuration.
	grunt.initConfig({
		coffee: {
			build: {
				src: ["src/*.coffee"],
				dest: "build",
				options: {
					bare: false
				}
			}
		},
		min: {
			build: {
				src: ["build/nori.js"],
				dest: "build/nori.min.js"
			}
		},
		watch: {
			files: "src/*.coffee",
			tasks: "default"
		}
	});

	// Default task.
	grunt.registerTask("default", "coffee min");

};
