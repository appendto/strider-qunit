var runner = require('./qunit-runner')

module.exports = function(ctx, cb) {

    ctx.addDetectionRule({
            filename: "test/index.html"
          , grep: /qunit/gi
          , exists: true
          , language: "javascript"
          , framework: "qunit"
          , prepare: function(ctx, cb){

              var opts = {
                // TODO use path() for :
                testfile : ctx.workingDir + '/test/index.html' // TODO override from db
              , testdir: ctx.workingDir + '/test' // TODO overide from DB
              , port: 4000
              , path: ctx.workingDir
              }

             runner.start(opts, cb);


             console.log("!!! START QUNIT TEST SERVER :", arguments);

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
