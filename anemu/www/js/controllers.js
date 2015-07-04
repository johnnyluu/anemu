angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Camera, $timeout, $ionicScrollDelegate, $ionicModal, $ionicLoading) {
  $scope.currentPhoto = {photo: "", location: {}};
  $scope.identifying = false;

  $ionicModal.fromTemplateUrl('templates/details.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openDetails = function(n) {
    $scope.modal.show();
    $scope.number = n;
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.loading = function() {
    $ionicLoading.show({
      template: '<ion-spinner class="spinner-energized"></ion-spinner><br/>Loading...'
    });
  };
  $scope.upload = function(){
    $scope.loading();
    $timeout(function(){
      $scope.doneLoading();
    }, 1000);
  }
  $scope.doneLoading = function(){
    $ionicLoading.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.getPhoto = function(options) {
    // console.log(options);
    $scope.loading();
    Camera.getPicture(options).then(function(imageURI) {
      // console.log(imageURI);
      $scope.currentPhoto.photo = imageURI;
      $scope.doneLoading();
    }, function(err) {
      $scope.doneLoading();
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
    // $timeout(function(){
      // alert($ionicScrollDelegate.scrollTop);
      $ionicScrollDelegate.scrollTop();
    // }, 500)
  }

  $scope.removePhoto = function(){
    $scope.currentPhoto = {};
  }
})

.controller('ChatsCtrl', function($scope, Chats, $ionicModal) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.sightings = ['Big emu', 'Little emu', 'Emu king']
  $ionicModal.fromTemplateUrl('templates/details2.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal2 = modal;
  });
  $scope.openDetails = function(n) {
    $scope.modal2.show();
    $scope.number = n;
  };
  $scope.closeModal = function() {
    $scope.modal2.hide();
  };
  // $scope.chats = Chats.all();
  $scope.remove = function(sighting) {
    $scope.sightings.splice($scope.sightings.indexOf(sighting),1);
  }

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.sighting = $stateParams.sighting;
  // alert($scope.sighting);
})

.controller('AccountCtrl', function($scope, Chats, $ionicScrollDelegate, $timeout) {
  $scope.setting;
  $scope.$watch('local',function(){
    console.log('haha');
    $timeout(function(){
      $ionicScrollDelegate.resize();
    })
  })
});
