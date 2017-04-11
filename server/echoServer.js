var net = require('net');
var server = net.createServer();

server.on("connection", function(socket){
	var remoteaddress = socket.remoteAddress + ":" + socket.remotePort;
	console.log("New Client Connected", remoteaddress);
	socket.on("data", function(d){
		console.log("Data from ", remoteaddress);
		console.log(d.toString());
		socket.write("64101 60601 650065006500650065006500650065006500650005500000000000000      100 001000005516005516077.50007850043990034532          0000000000000          0000000000000          0000000000000          0000000000000          0000000000000          0000000000000          0000000000000          0000000000000ACTUAL 001785000896920000000000000000000000000178500089692650000058300000313920     000000000031392 MARS 500       20010806                    00                                                  ");
	});

	socket.once("close", function(){
		console.log("Connection closed", remoteaddress);
	});

	socket.on('error', function(err){
		console.log("Connection Error", remoteaddress, err.message);
	});
});

server.listen(9000, function(){
	console.log('Server is listening on', server.address());
});