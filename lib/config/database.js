'use strict';

module.exports = function (app, mongoose) {
	var connect = function () {
		var options = {
			server: {
        socketOptions: { keepAlive: 1 }
      },
      auto_reconnect: true
    };

    mongoose.connect(app.config.database.url, options);
  };

	connect();

  // Error handler
  mongoose.connection.on('error', function (err) {
    console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.\n' + err);
  });

  /*
   * Override of default error messages
   */
  mongoose.Error.messages.general.required = "Required";
};
