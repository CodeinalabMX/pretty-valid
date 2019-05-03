module.exports = {

  optimize: true,

  modules: {
    wrapper: false
  },

  plugins: {
    
    terser: {
      ignored: /\.mins\./,
      output: {
        comments: /^!/
      }
    },

    cleancss: {
      ignored: /\.mins\./,
      level: 2,
      specialComments: 'all'
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