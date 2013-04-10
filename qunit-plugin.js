// Here begins strider-qunit extension plugin
;(function(){

  // Tiny Ajax Post
  var post = function (url, json, cb){
    var req;

    if (window.ActiveXObject)
      req = new ActiveXObject('Microsoft.XMLHTTP');
    else if (window.XMLHttpRequest)
      req = new XMLHttpRequest();
    else 
      throw "Strider: No ajax"

    req.onreadystatechange = function () {
        if (req.readyState==4)
          cb(req.responseText);
      };

    req.open("POST", url, true);
    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.setRequestHeader('Connection', 'close');
    req.send(JSON.stringify(json));
  }

  var striderErrors = [];

  QUnit.log(function(res, actual, expected, message, source){
    if (!res){
      // Failure:
      __StriderErrors.push({actual: actual, expected:expected, message: message, source: sourc}) 
    }

  })

  QUnit.done(function(results){
    results.tracebacks = striderErrors;
    result.url = window.location.href;
    post("/strider-report", result, function(){});
  })
})();
// End Strider
