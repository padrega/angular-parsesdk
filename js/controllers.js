app.controller('PaginationController', function($scope, $timeout, parsePersistence, parseQuery, MicroCache, blockUI) {

    $scope.current = 1;
    $scope.items = [];
    $scope.total = 0;
    $scope.pageSize = 5;
    $scope.search = "";

    $scope.refresh = function() {
        MicroCache.clear();
        $scope.total = 0;
        $scope.pageChanged(1);
    }
    $scope.pageChanged = function(newPage) {
        $scope.current = newPage;
        var key = "TestObject-" + $scope.current;
        if (MicroCache.contains(key)) {
            $scope.items = MicroCache.get(key);
        } else {
            blockUI.start();
            var query = "";
            if ($scope.search === "") { 
                  query = parseQuery.new('TestObject').skip(($scope.current-1)*$scope.pageSize).limit($scope.pageSize);
                }  else {
                  query = parseQuery.new('TestObject').contains('objectId', $scope.search).skip(($scope.current-1)*$scope.pageSize).limit($scope.pageSize);
                }
            parseQuery.find(query)
            .then(function(results) {
                $scope.items = results;
                MicroCache.set(key, results);
                parseQuery.count(query)
                .then(function(total) {
                    $scope.total = total;
                }, function(error) {
                    alert(JSON.stringify(error));
                });
                blockUI.stop();
            }, function(error) {
              blockUI.stop();
              alert(JSON.stringify(error));
            });
            
        }
    };

    $scope.pageChanged(1);  
});