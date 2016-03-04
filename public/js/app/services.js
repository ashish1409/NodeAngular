function npmService ($q, $http) {
    var self = this;

    self.getData = function(){
        var deferred = $q.defer();
        $http.get('http://127.0.0.1:8081/listUsers', {}).success(function(res){
            deferred.resolve(res);
        }).error(function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    }

    self.postData = function(obj){
        var deferred = $q.defer();
        $http.post('http://127.0.0.1:8081/post', obj).success(function(res){
            console.log(res)
            deferred.resolve(res);
        }).error(function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    }

    self.deleteUser = function(obj){
        var deferred = $q.defer();
        $http.post('http://127.0.0.1:8081/delete', obj).success(function(res){
            console.log(res)
            deferred.resolve(res);
        }).error(function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    }
}
npmService.$inject = ['$q', '$http'];
app.service('npmService', npmService);