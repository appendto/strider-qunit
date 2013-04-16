var runner = require('run-qunit')

var createResultsHandler = function(ctx){
  return function(res){
    console.log("strider-qunit > Results:", res);
    ctx.events.emit('testDone', res);
  }
}


module.exports = function(ctx, cb) {

    ctx.addDetectionRule({
            filename: "test/index.html"
          , grep: /qunit/gi
          , exists: true
          , language: "javascript"
          , framework: "qunit"
          , prepare: function(ctx, cb){

              if (!ctx.events){
                throw "strider-qunit requires a worker with events bus - is your strider-simple-worker out of date?"
              }

              var cgi = require('gateway')(ctx.workingDir, {'.php': 'php-cgi'})

              var cgiwrap = function(){
                console.log("!!! -> CGI: ", req.url)
                return cgi.apply(this, arguments);
              }

              var opts = {
                // TODO use path() for :
                testfile : ctx.workingDir + '/test/index.html' // TODO override from db
              , testdir: ctx.workingDir  // TODO overide from DB
              , port: 4000
              , path: ctx.workingDir
              , useID : true
              , middleware : [cgi]
              }


             ctx.striderMessage("Setting up qunit server");
             ctx.browsertestPort =  opts.port;
             ctx.browsertestPath = "/test/index.html" //TODO overwrite from DB

             runner.start(opts, createResultsHandler(ctx), function(){
               ctx.striderMessage("Strider-QUnit Runner Started");
               cb(0)
             });

           }

           , cleanup: function(ctx, cb){
            if (runner.open()){
              runner.close()
            }
            cb(0)
          }
        })

  console.log("strider-qunit extension loaded")
  cb(null, null);
}
