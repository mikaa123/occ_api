var config = {
	development: {
		server: {
			port: 3000,
			hotname: 'localhost'
		},

		database: {
			url: 'mongodb://localhost/bnd'
		},

		auth: {
			twitter: {
				consumerKey: process.env.TWITTER_KEY || 'YZt0dzx3ylMggxxFpURQj18S7',
				consumerSecret: process.env.TWITTER_SECRET  || 'GXDZkmtHxDZMCmgNqXxAZWxbKVebhVycEX7NREJqiboZVF4SpA',
				callbackURL: '/auth/twitter/callback',
				passReqToCallback: true
			}
		}
	}
};

module.exports = config[process.env.NODE_env || 'development'];
