angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, Camera, $timeout, $ionicScrollDelegate, $ionicModal, $ionicLoading) {
  $scope.currentPhoto = {photo: "", location: {}};
  $scope.identifying = false;

  $ionicModal.fromTemplateUrl('templates/details.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.animalNode = {};
  $scope.animalInfo = {};
  $scope.openDetails = function(animalNode) {
    $scope.modal.show();
    $scope.animalNode = animalNode;
    $http.get('http://teardesign.com/anemu/anemu/public/animal/'+$scope.animalNode.imageID).success(function(data) 
    {
        console.log(data);
         $scope.animalInfo = angular.copy(data);
    });
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.animalInfo = {};
  };
  $scope.startOver = function(){
    $scope.closeModal();
    $scope.closeIdentify();

  }
  $scope.loading = function() {
    $ionicLoading.show({
      template: '<ion-spinner class="spinner-energized"></ion-spinner><br/>Loading...'
    });
  };
  $scope.upload = function(){
    
    $scope.loading();
    var sightings = window.localStorage['sightings'] || '{"sightings":[]}';
    var mySightings = JSON.parse(sightings);
    var currentDate = new Date();
    mySightings.sightings.unshift([$scope.animalNode.imageID, currentDate])
    var mySave = JSON.stringify(mySightings);
    window.localStorage['sightings'] = mySave;
    navigator.geolocation.getCurrentPosition(function(position) {
      

    $http.get('http://teardesign.com/anemu/anemu/public/sighting?id='+$scope.animalNode.imageID+'&lat='+position.coords.latitude+'&lon='+position.coords.longitude+'&username=Anemu User').success(function(){
      $timeout(function(){
        $scope.doneLoading();
      }, 1000);
    });

  });

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
    // $scope.currentPhoto.location.latitude = position.coords.latitude;
    // $scope.currentPhoto.location.longtitude = position.coords.longitude;
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
      $ionicScrollDelegate.scrollTop();
  }

  $scope.closeIdentify = function(){
    $scope.identifying = false;
    $scope.initTree();
  }

  $scope.removePhoto = function(){
    $scope.currentPhoto = {};
  }

  $scope.initTree = function(){
    $scope.animalTree = [];
    $http.get('http://teardesign.com/anemu/anemu/public/tree').success(function(data) 
    {
        console.log(data);
         $scope.animalTree = angular.copy(data);
    });
  }

  $scope.initTree();
  

  $scope.getNextNodes = function(animalNode) 
  {
      if (animalNode.children)
        $scope.animalTree = angular.copy(animalNode.children);
      else
        $scope.openDetails(animalNode)
  };

})

.controller('ChatsCtrl', function($scope, Chats, $ionicModal, $http) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
    var sightings = window.localStorage['sightings'] || '{sightings:[]}';
    var mySightings = JSON.parse(sightings);
  $scope.sightings = mySightings.sightings;
  $ionicModal.fromTemplateUrl('templates/details2.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal2 = modal;
  });
  $scope.initTree = function(){
    $scope.animalTree = [];
    $http.get('http://teardesign.com/anemu/anemu/public/tree').success(function(data) 
    {
        console.log(data);
         $scope.animalTree = angular.copy(data);
    });
  }

  $scope.initTree();
  

  $scope.getNextNodes = function(animalNode) 
  {
      if (animalNode.children)
        $scope.animalTree = angular.copy(animalNode.children);
      else
        $scope.openDetails(animalNode)
  };
  $scope.openDetails = function(animalNode) {
    $scope.modal2.show();
    $scope.animal = animalNode;
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

.controller('AccountCtrl', function($scope, Chats, $ionicScrollDelegate, $timeout, $http) {
  $scope.setting;
  $scope.$watch('local',function(){
    // console.log('haha');
    $timeout(function(){
      $ionicScrollDelegate.resize();
    })
  })
  $scope.initTree = function(){
    $scope.animalTree = [];
    $http.get('http://teardesign.com/anemu/anemu/public/tree').success(function(data) 
    {
        console.log(data);
         $scope.animalTree = angular.copy(data);
    });
  }

  $scope.initTree();
  

  $scope.getNextNodes = function(animalNode) 
  {
      if (animalNode.children)
        $scope.animalTree = angular.copy(animalNode.children);
      else
        $scope.openDetails(animalNode)
  };
});
