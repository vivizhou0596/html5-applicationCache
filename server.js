const http =  require("http");
const fs = require('fs');
http.createServer(function(req,res){
	res.writeHead(200,{'Content-Type':'text/html'});
	// res.write( 'index.html' );
	// res.end()
	console.log(req.url)
	var fileName ='./'+ req.url;
	 fs.readFile( 'index.html', function( err, data ){
		if( err ){
		    res.write( '404' );
		}else {
		    res.write( data );
		}
		res.end();
	 });
}).listen(8888);
console.log('server running at http://27.0.0.1:8888/')