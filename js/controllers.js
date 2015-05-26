app.controller('PaginationController', function($scope, $timeout, parsePersistence, parseQuery, MicroCache) {

    $scope.current = 1;
    $scope.items = [];
    $scope.total = 0;
    $scope.pageSize = 5; 

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
            var query = parseQuery.new('TestObject').skip(($scope.current-1)*$scope.pageSize).limit($scope.pageSize);
            
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
            }, function(error) {
                alert(JSON.stringify(error));
            });
        }
    };

    $scope.pageChanged(1);  
});