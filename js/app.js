/// <reference path="../../typings/angularjs/angular.d.ts"/>
/* global Parse */

Parse.initialize("TgB1ZolkjZiMzMmpJibp5K941ieYIAlgvFWgmfTs", "3ztl0oMYStvKkVWoafOJlrlTMK4R1a8GrDbVQ6iR");

var app = angular.module('plunker', ["angularParse","brantwills.paging"]);

app.controller('MainCtrl', function($scope, $timeout, parsePersistence, parseQuery) {

  $scope.data = { 
    items: [],
    total: 0,
    page: 0,
    pageSize: 5
  };
  
  // adds a new object to server
  $scope.add = function() {
    
    var testObject = parsePersistence.new('TestObject');
    
    parsePersistence.save(testObject, {foo: "bar promise"})
    .then(function(object) { 
      $scope.data.items.push(object);
      $scope.data.total++;
    }, function(error) {
      alert(JSON.stringify(error));
    });
  };
  
  // retrieve a list of 10 items from server and the total number of items
  $scope.find = function() {

    var query = parseQuery.new('TestObject').limit($scope.data.pageSize);
    
    parseQuery.find(query)
    .then(function(results) {
      $scope.data.items = results;
      
      // nested promise :)
      return parseQuery.count(query);
    })
   .then(function(total) {
      $scope.data.total = total;
    }, function(error) {
      alert(JSON.stringify(error));
    });
    
  };
  $scope.hasNext = function() {
    return $scope.getPagePostion() + $scope.data.pageSize < $scope.data.total;
  };
  $scope.next = function() {
    if ($scope.hasNext()) {
      $scope.data.page++;
      findPagination();   
    }
  };
  $scope.prev = function() {

    if ($scope.getPagePostion() >= 0) {
      $scope.data.page--;
      findPagination();
    }
  };
  $scope.getPagePostion = function () {
    return $scope.data.pageSize*$scope.data.page;
  };
  function findPagination() {
    var query = parseQuery.new('TestObject').skip($scope.getPagePostion()).limit($scope.data.pageSize);
    
    parseQuery.find(query)
    .then(function(results) {
      $scope.data.items = results;
    }, function(error) {
      alert(JSON.stringify(error));
    });
  }
  
  // removes an object from server
  $scope.destroy = function(obj) {
   
    parsePersistence.destroy(obj)
    .then(function(result) {
      $scope.data.items.splice($scope.data.items.indexOf(obj),1);
      $scope.data.total--;
    }, function(error) {
      alert(JSON.stringify(error));
    });
    
  };
  
});
