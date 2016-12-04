var http = require("http");
var apn = require('apn'); 
var gcm = require('node-gcm-service');

var port = 9009;

function getHome(req, resp) {
	resp.writeHead(200, {"Content-Type" : "text/html"});
	resp.write("<html><body> Calculation here? <a href='/calc'>here</a></body></html>");
	resp.end();
}

function get404(req, resp) {
	resp.writeHead(404, "Resource not found",{"Content-Type" : "text/html"});
	resp.write("<html><title>404</title><body> 404: Resource not found. Go to <a href='/'>home</a></body></html>");
	resp.end();
}

function get405(req, resp) {
	resp.writeHead(405, "Method not supported",{"Content-Type" : "text/html"});
	resp.write("<html><title>404</title><body> 405: Resource not found. Go to <a href='/'>home</a></body></html>");
	resp.end();
}

function getHome(req, resp) {
	resp.writeHead(200, {"Content-Type" : "text/html"});
	resp.write("<html><body> Calculation here? <a href='/calc'>here</a></body></html>");
	resp.end();
}

function getCalcHtml(req, resp, data) {
	var sb = new StringBuilder({newline: "\r\n"});
	sb.appendLine("<html>");
	sb.appendLine("<body>");
	sb.appendLine("		<form method='post'>");
	sb.appendLine("			<table>");
	sb.appendLine("				<tr>");
	sb.appendLine("					<td>Enter First No:</td>");

	if (data && data.txtFirstNo){
		sb.appendLine("					<td><input type='text' id='txtFirstNo' name='txtFirstNo' value='{0}'></td>", data.txtFirstNo);
	} else{
		sb.appendLine("					<td><input type='text' id='txtFirstNo' name='txtFirstNo' value=''></td>");
	}

	sb.appendLine("				</tr>");
	sb.appendLine("				<tr>");
	sb.appendLine("					<td>Enter Second No:</td>");
	if (data && data.txtSecondNo){
		sb.appendLine("					<td><input type='text' id='txtSecondNo' name='txtSecondNo' value='{0}'></td>", data.txtSecondNo);
	} else{
		sb.appendLine("					<td><input type='text' id='txtSecondNo' name='txtSecondNo' value=''></td>");
	}
	sb.appendLine("				</tr>");
	sb.appendLine("				<tr>");
	sb.appendLine("					<td><input type='submit' value='Calculate'></td>");
	sb.appendLine("				</tr>");
	if (data && data.txtFirstNo && data.txtSecondNo){
		var sum = parseInt(data.txtFirstNo) + parseInt(data.txtSecondNo);
		sb.appendLine("				<tr>");
		sb.appendLine("					<td><span> sum = {0}</span></td>", sum);
		sb.appendLine("				</tr>");
	}
	sb.appendLine("			</table>");
	sb.appendLine("		</form>");
	sb.appendLine("</body>");
	sb.appendLine("</html>");

	sb.build(function(err, result){
		resp.write(result);
		resp.end();
	});
}

function getCalcForm(req, resp, formData){
	resp.writeHead(200, {"Content-Type":"text/html"});
	getCalcHtml(req, resp, formData);
}

http.createServer(function(req, resp) {

	console.log(req.url);
	switch (req.method) {
		case "GET":
		if (req.url === "/") {
			getHome(req, resp);

		}
		else if (req.url === "/calc") {
			getCalcForm(req, resp);
		} else {
			get404(req, resp);
		}
		break;
		case "POST":
		if(req.url === "/calc"){
			var reqBody='';
			req.on('data', function(data){
				console.log(reqBody);
				reqBody += data;

				if (req.length > 1e7) //10MB
				{
					resp.writeHead(413, 'Request Enttity too large', {'Content-Type':'text/html'});
					resp.write("<html><title>413</title><body> 413: Too much of information</body></html>");
					resp.end();
				}
			});
			req.on('end', function(data){
				var formData = qs.parse(reqBody);
				getCalcForm(req, resp, formData);
				console.log(reqBody);
			});
		}
		else {
			get404(req, resp);
		}
		break;
		default:
		get405(req, resp);
		break;
	}
	// resp.writeHead(200, {"Content-Type":"text/html"});
	// resp.write("<html><body> Hello
	// <strong><i>World!</i><strong></body></html>");
	// resp.end();
}).listen(port);
