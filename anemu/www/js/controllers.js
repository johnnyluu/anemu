angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Camera, $timeout) {
  $scope.currentPhoto = {photo: "", location: {}};
  $scope.identifying = false;

  $scope.getPhoto = function(options) {
    // console.log(options);
    Camera.getPicture(options).then(function(imageURI) {
      console.log(imageURI);
      $scope.currentPhoto.photo = imageURI;
    }, function(err) {
      console.log(err);
    });
    // $scope.getPosition();
    var onSuccess = function(position) {
    // alert('Latitude: '          + position.coords.latitude          + '\n' +
    //       'Longitude: '         + position.coords.longitude         + '\n' +
    //       'Altitude: '          + position.coords.altitude          + '\n' +
    //       'Accuracy: '          + position.coords.accuracy          + '\n' +
    //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    //       'Heading: '           + position.coords.heading           + '\n' +
    //       'Speed: '             + position.coords.speed             + '\n' +
    //       'Timestamp: '         + position.timestamp                + '\n');
    // };
      $scope.currentPhoto.location.latitude = position.coords.latitude;
      $scope.currentPhoto.location.longtitude = position.coords.longitude;
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };

  $scope.identify = function(){
    $scope.identifying = !$scope.identifying;
    $timeout(function(){
      alert(document.getElementById('buttons').scrollTop);
      document.getElementById('buttons').scrollTop = 0;
    }, 500)
  }

  $scope.removePhoto = function(){
    $scope.currentPhoto = {};
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
