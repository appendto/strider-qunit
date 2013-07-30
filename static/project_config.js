
;(function () {

  function save(url, data, done) {
    data = _.extend({url: url}, data);
    $.ajax({
      url: '/api/qunit',
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function (data, ts, xhr) {
        done(null);
      },
      error: function (xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          e = data.errors[0];
        }
        done(e);
      }
    });
  }

  app.controller('QunitCtrl', ['$scope', function ($scope) {
    $scope.data = $scope.panelData.qunit_config;
    $scope.save = function () {
      $scope.loading = true;
      save($scope.repo.url, $scope.data, function (err) {
        $scope.loading = false;
        if (err) {
          $scope.error('Failed to save qunit config: ' + err);
        } else {
          $scope.success('Saved qunit config');
        }
        $scope.$root.$digest();
      });
    };
  }]);
})();
