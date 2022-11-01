module.exports = {

  optimize: false,

  modules: {
    wrapper: false,
    nameCleaner: path => path.replace(/^src\//, '')
  },

  plugins: {
    
    terser: {
      //* ignored: /[regex]/,
      output: {
        comments: /^!/
      }
    },

    cleancss: {
      //ignored: /[regex]/,
      level: 2,
      //specialComments: 1
    }

  },

	paths: {
  	public: 'dist',
  	watched: ['src']
	},

  files: {

    javascripts: {
    	joinTo: {
        'js/pretty-valid.min.js': [
          'src/js/pretty-valid_draft.js'
        ], 
        '../test/js/main.min.js': [
          'src/js/main_draft.js'
        ]
    	}
  	},

    stylesheets: {
    	joinTo: {
    		'css/pretty-valid.min.css': [
          'src/css/pretty-valid_draft.css'
        ]
    	}
    },

  },

  npm: {

    globals: {
      //$: 'jquery',
      //jQuery: 'jquery'
    },

    styles: {
      //'node_modules/library_folder': ['css/file.css']
    }

  }

}