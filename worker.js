var runner = require('./qunit-runner')

var createResultsHandler = function(ctx){
  return function(resbody){
    console.log("strider-qunit > Results:", resbody);

    var res = JSON.parse(resbody[data])

    for (var i = 0; i<res.tracebacks.length; i++){
      res.tracebacks[i] = JSON.parse(res.tracebacks[i])
    }

    ctx.events.emit('results', res);
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

              var opts = {
                // TODO use path() for :
                testfile : ctx.workingDir + '/test/index.html' // TODO override from db
              , testdir: ctx.workingDir  // TODO overide from DB
              , port: 4000
              , path: ctx.workingDir
              }


             console.log("Setting up qunit server:", opts);

             // TEMP TODO
             require('child_process').exec("grunt || (npm install && grunt)", {cwd: ctx.workingDir}, function(err, stdout, stderr){
               console.log("Grunt finished")
               runner.start(opts, createResultsHandler(ctx), cb);
             });


           }

          , test: function(){
            // Do NOTHING
            // Either a cloud browser, or a manual one
            // will connect and run the tests.
            // Because they might want to run more than one 
            // browser, we leave the server running for them.
          }

          , cleanup: function(){
            if (runner.open()){
              runner.close()
            }
          }
        })

  console.log("strider-qunit extension loaded")
  cb(null, null);
}
