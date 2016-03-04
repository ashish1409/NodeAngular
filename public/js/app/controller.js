//main controller
app.controller('npmCtrl', ['$scope','npmService','$rootScope','$location', function($scope, npmservice,$rootScope,$location){
  
// for cart count and nav bar
  $rootScope.showNav = false;
  $rootScope.cartCount  = 0;
  $scope.addToCartClick = function(){
      $location.path("/cart")
  }; 

  npmservice.getData().then(function(res){
    $scope.userdata = res;
    console.log($scope.userdata)
    $scope.formobj = {
      name : ""
    }

  });
//var formobjNew = [];




 $scope.submitForm = function(obj){
  console.log(obj)

    if(obj.name == ""){
      alert("Please insert values")
    }
    else{
      obj["arrLength"] = Object.keys($scope.userdata).length
      npmservice.postData(obj).then(function(res){  
      //console.log(res)  
        $scope.userdata = res;  
        Object.keys($scope.formobj).map(function(k){
          $scope.formobj[k] = ""
        });   
      })
    }
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
   $scope.addToCart = function(productName,productDis,productPrice,productImg,qty, Id){     
    $scope.cartItems.push({
      "productId": "P1",
      "productImg": productImg,
      "productName": productName,
      "productPrice": productPrice,
      "productDis": productDis,
      "qty":qty
    })
    $scope.productId = Id

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
          total += item.productPrice*item.qty           
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