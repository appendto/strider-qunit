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
                testfile : 'test/index.html' // TODO override from db
              , testdir: 'test' // TODO overide from DB
              }

             server.start(opts, cb);


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
