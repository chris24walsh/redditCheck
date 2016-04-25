require('cloud/app.js');
var Mailgun = require('mailgun');
Mailgun.initialize('sandbox1287a4b2510d4161ba9eb2b8dc0bda53.mailgun.org', 'key-0a5b959ae314679ee1983ab8afccdc05');
	
// Using Mailgun module to send the notification emails
Parse.Cloud.define("sendMail", function(request, response) {
	Mailgun.sendEmail({
		to: "chris24walsh@gmail.com",
		from: "Mailgun <postmaster@sandbox1287a4b2510d4161ba9eb2b8dc0bda53.mailgun.org>",
		subject: "Reddit check",
		text: request.params.message
	}, {
		success: function(httpResponse) {
			console.log("Email response: " + httpResponse);
			response.success("Email sent!");
		},
		error: function(httpResponse) {
			console.error(httpResponse);
			response.error("Uh oh, something went wrong");
		}
	});
	response.success("Email sent!");
});
Parse.Cloud.job("checkReddit", function(request, response) {
	Parse.Cloud.httpRequest({
		url:'https://www.reddit.com/user/eihe',
		//url:'walsh.tk',
		success:function(response){
			var string = response.text;
			console.log("Http response: " + response.text);
			var result = string.search("there doesn't seem to be anything here");
			if (result > 0) {
				console.log("Still no posts from Abbie :(");
				var mes = "Still no posts from Abbie :(";
			}
			else {
				console.log("Abbie has posted something on Reddit");
				var mes = "Abbie has posted something on Reddit!! :)";
				Parse.Cloud.run("sendMail", {message: mes}, {
					success: function(success) {
					}, error: function(error) {
					}
				});
			}
		},
		error:function(response){
			console.error(response);
		}
	});
});
