//main controller
app.controller('npmCtrl', ['$scope','npmService','Upload','$rootScope','$location','$window', function($scope, npmservice,Upload,$rootScope,$location,$window){
    $scope.BaseImageUrl = $location.protocol()+'://'+$location.host()+':'+$location.port()+'/images/';
// for cart count and nav bar
  $rootScope.showNav = false;
  $rootScope.cartCount  = 0;
  $scope.addToCartClick = function(){
      $location.path("/cart")
  }; 
  $scope.logout = function(){
     $location.path("/")
  }

  npmservice.getData().then(function(res){
    $scope.userdata = res;
 //   console.log($scope.userdata)
    $scope.formobj = {
      product : ""
    }

  });



  $scope.upload = function (file,obj) {
    //console.log($scope.file)
      Upload.upload({
          url: 'http://127.0.0.1:8081/upload', //webAPI exposed to upload the file
          data:{file:file} //pass file as data, should be user ng-model
      }).then(function (resp) { //upload function returns a promise
     //   console.log('ghfghg', resp.data.fileDetails.filename)
          if(resp.data.error_code === 0){ //validate success
              //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
              if(resp.data.fileDetails.filename){
                obj.ProfileImage = resp.data.fileDetails.filename
              }else{
                obj.ProfileImage = "default.png"
              }
              $scope.UploadData(obj);

          } else {
              $window.alert('an error occured');
          }
      }, function (resp) { //catch error
          console.log('Error status: ' + resp.status);
          //$window.alert('Error status: ' + resp.status);
      }, function (evt) { 
          //console.log(evt);
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
          $scope.progress = progressPercentage + '% '; // capture upload progress
      });
  };


 $scope.submitForm = function(obj){
    if (obj.file && obj.name !== "") { //check if from is valid
        $scope.file = obj.file
        $scope.upload($scope.file, obj); //call upload function
    }
    else if(obj.name == ""){
      alert("Please insert values")
    }
  }
 $scope.UploadData = function(obj){
      npmservice.postData(obj).then(function(res){  
      //console.log(res)  
        $scope.userdata = res;  
        Object.keys($scope.formobj).map(function(k){
          $scope.formobj[k] = ""
        });   
      })
};


$scope.Logout = function(){
  alert(0);
  }




//edit data
  $scope.EditUser = function(obj){

   // console.log(index);

   $scope.formobj = angular.copy(obj);
  // $scope.formobjNew = $scope.formobj;
  //  console.log($scope.formobjNew)
  }


//delete data
  $scope.deleteUser = function(obj){
    
    // obj = {'deleteUserId':obj};
    console.log(obj)
    npmservice.deleteUser(obj).then(function(res){  
    $scope.userdata = res;  
    })
  }
  
}])

//login Controller
app.controller('loginCtrl',['$scope' , '$http', '$location','$rootScope', function ($scope, $http, $location, $rootScope) {
  $scope.submitLogin = function(){
    if($scope.userName=="admin" && $scope.password=="admin" ){      
      $rootScope.showNav = false;
      $location.path("/admin");
    }
    else if($scope.userName=="ashish" && $scope.password=="ashish123" ){
      $rootScope.showNav = true;
      $location.path("/product")
    }
    else{
      alert("Please enter correct user Name And password");
      $rootScope.showNav = false;
    }
  };
}])


app.controller('productCtrl',['$scope' , '$http', '$location','$rootScope','npmService', function ($scope, $http, $location, $rootScope,npmService) {

$rootScope.showNav = true;

//Get product list from json using service  
registeredUsers();

  function registeredUsers(){
    npmService.getData().then(function(response){
      $scope.productListsCart= response;
    }), function(error){} 
  }
//Pass value from function  and get from controller
$scope.cartItems = [];
   $scope.addToCart = function(pid, product,price,description,quantity,ProfileImage,number, Ind){     
    $scope.cartItems.push({
      "pid": "P1",
      "product": product,
      "price": price,
      "description": description,
      "quantity": quantity,
      "ProfileImage": ProfileImage,
      "Ind": Ind
    })




    $scope.productId = pid

    //Define val of cart count
    $rootScope.cartCount = $scope.cartItems.length

    //Set and Get Data from local storage
    var setCartItemList = JSON.stringify($scope.cartItems);
    localStorage.setItem("cartItemList", setCartItemList);
    var cartItemList = JSON.parse(window.localStorage.getItem('cartItemList'));
  $rootScope.cartItemsVal = cartItemList
}

// // Remove  cart value details
  $scope.removeItem = function(index) {
        $rootScope.cartItemsVal.splice(index, 1);
    }

// // Add all cart value
  $scope.total = function() {
      var total = 0;
      angular.forEach($rootScope.cartItemsVal, function(item) {
          total += item.price*item.quantity           
      })
      return total;
   }
// // Remove  cart value details
  $scope.continueShopping = function(index) {
        $location.path("/product")
    }
    // Check out shopping

$scope.checkOutShopping = function(){   

  var cartItemList = JSON.parse(window.localStorage.getItem('cartItemList'));
  $rootScope.cartItemsVal = cartItemList
  console.log(cartItemList); 
}
}])