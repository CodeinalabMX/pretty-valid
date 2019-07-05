module.exports = {

  optimize: true,

  modules: {
    wrapper: false,
    nameCleaner: path => path.replace(/^src\//, '')
  },

  plugins: {
    
    terser: {
      /* Use ignored to skip files from process
       * keep in mind that terser runs on files created by joinTo */
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
  	public: 'public_html',
  	watched: ['src']
	},

  files: {

    javascripts: {
    	joinTo: {
        'js/pretty-valid.min.js': [
          'src/js/pretty-valid_draft.js'
        ], 
        'js/main.min.js': [
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

  }

}