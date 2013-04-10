var connect = require('connect')
  , http = require('http')
  , fs = require('fs')

var server;




module.exports = {
    start: function(opts, cb){
      var app = connect()

      app.use(connect.bodyParser());

      app.use(function(req, res, next){
        if (req.url == '/strider-res'){
          console.log("TEST RESULTS", req.body);
          return res.end("Results received")

        } else if (/^\/strider/.test(req.url)){
          console.log("!!>> Strider serve test")
          var f = fs.readFileSync(opts.testfile, 'utf8')
          f += "<script>" + fs.readFileSync(__dirname + "/qunit-plugin.js", "utf8");
          return res.end(f);
        }
        return next();
      });

      app.use(connect.static(opts.testdir))
      server = http.createServer(app)
      server.listen(opts.port);
    }


  , open: function(){return !!server}

  , close: function(){
    if(server){
      server.close();
      server = null;
    }
  }
}
