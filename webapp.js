//
// # QUnit Webapp extension for QUnit tests
//
// By default we'll try and guess defaults for
// how to run your qunit tests, but you are welcome
// to override them if we got it wrong.
//

var path = require('path')

module.exports = function(ctx, cb) {
  /*
   * GET /api/qunit/
   *
   * Get the current Strider config for specified project. This will be a JSON-encoded
   * object with the keys: 'test_files'
   *
   * @param url Github html_url of the project.
   */
  function getIndex(req, res) {
    var url = req.param("url")

    function error(err_msg) {
      console.error("Strider-QUnit: getIndex() - %s", err_msg)
      var r = {
        errors: [err_msg],
        status: "error"
      }
      res.statusCode = 400
      return res.end(JSON.stringify(r, null, '\t'))
    }

    req.user.get_repo_config(url, function(err, repo, access_level, owner_user_obj) {
      if (err) {
        return error("Error fetching Repo Config for url " + url + ": " + err)
      }
      var r = {
        status: "ok",
        errors: [],
        results: {
          file: repo.get('qunit_file'),
          path: repo.get('qunit_path'),
        }
      }
      return res.end(JSON.stringify(r, null, '\t'))
    })
  }

  /*
   * POST /api/qunit/
   *
   * Set the current Strider config for specified project.
   *
   * @param url Github html_url of the project.
   *
   */
  function postIndex(req, res) {
    var url = req.param("url")
      , path = req.body["qunit_path"]
      , file = req.body["qunit_file"]

    function error(err_msg) {
      console.error("Strider-QUnit: postIndex() - %s", err_msg)
      var r = {
        errors: [err_msg],
        status: "error"
      }
      res.statusCode = 400
      return res.end(JSON.stringify(r, null, '\t'))
    }

    req.user.get_repo_config(url, function(err, repo, access_level, owner_user_obj) {
      if (err) {
        return error("Error fetching Repo Config for url " + url + ": " + err)
      }
      // must have access_level > 0 to be able to continue;
      if (access_level < 1) {
        console.debug(
          "User %s tried to change qunit config but doesn't have admin privileges on %s (access level: %s)",
          req.user.email, url, access_level);
        return error("You must have access level greater than 0 in order to be able to configure qunit.");
      }
      var q = {$set:{}}
      repo.set('qunit_path', path)
      repo.set('qunit_file', file)

      var r = {
        status: "ok",
        errors: [],
        results: {
          files: repo.get('qunit_file'),
          path: repo.get('qunit_path')
        }
      }
      req.user.save(function(err) {
        if (err) {
          var errmsg = "Error saving qunit config " + req.user.email + ": " + err;
          return error(errmsg)
        }
        return res.end(JSON.stringify(r, null, '\t'))
      })
    })

  }

  // Extend RepoConfig model with 'QUnit' properties
  function qunitPlugin(schema, opts) {
    schema.add({
      qunit_file: String,
      qunit_path: String,
    })
  }
  ctx.models.RepoConfig.plugin(qunitPlugin)

  // Add webserver routes
  ctx.route.get("/api/qunit",
    ctx.middleware.require_auth,
    ctx.middleware.require_params(["url"]),
    getIndex)
  ctx.route.post("/api/qunit",
    ctx.middleware.require_auth,
    ctx.middleware.require_params(["url"]),
    postIndex)

  // Add panel HTML snippet for project config page
  ctx.registerPanel('project_config', {
    src: path.join(__dirname, "templates", "project_config.html"),
    title: "QUnit Config",
    id:"qunit_config",
    plugin_name: 'strider-qunit',
    controller: 'QunitCtrl',
    data: ['qunit_file', 'qunit_path']
  })


  console.log("strider-qunit webapp extension loaded")

  cb(null, null)
}
