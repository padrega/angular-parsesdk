app.controller('PaginationController', function($scope, $timeout, parsePersistence, parseQuery) {

    $scope.current = 1;
    $scope.items = [];
    $scope.total = 0;
    $scope.pageSize = 5; 

    $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
    };

    function getResultsPage(pageNumber) {
        var query = parseQuery.new('TestObject').skip((pageNumber-1)*$scope.pageSize).limit($scope.pageSize);
        
        parseQuery.find(query)
        .then(function(results) {
            $scope.items = results;
            if ($scope.total === 0) {
                parseQuery.count(query)
                .then(function(total) {
                    $scope.total = total;
                }, function(error) {
                    alert(JSON.stringify(error));
                });
            }
            //$scope.$apply();
        }, function(error) {
            alert(JSON.stringify(error));
        });
    };
    
    getResultsPage(1);  
});