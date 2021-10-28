
var app = angular.module('stoneApp', ['ui.bootstrap',"ui.router",'angular-loading-bar','ngStorage']);

app.config(["$stateProvider","$urlRouterProvider","$httpProvider",function(t,e)
{
    e.otherwise("/hotels"),
        t
            .state("hotels",{
            url:"/hotels",
            templateUrl:"/js/templates/hotels.html",
            controller:'hotels'
            })
            .state("waiters",{
            url:"/waiters",
            templateUrl:"/js/templates/waiters.html",
            controller:'waiters'
            })
            .state("edit-hotel",{
            url:"/hotel/{id}",
            templateUrl:"/js/templates/add-hotel.html",
            controller:'edit-hotel'
            })
            .state("add-hotel",{
            url:"/add-hotel",
            templateUrl:"/js/templates/add-hotel.html",
            controller:'add-hotel'
            })
            .state("add-waiter",{
                url:"/add-waiter",
                templateUrl:"/js/templates/add-waiter.html",
                controller:'add-waiter'
            })
            .state("assignTablesToWaiters",{
            url:"/assignTablesToWaiters",
            templateUrl:"/js/templates/assignTablesToWaiters.html",
            controller:'assignTablesToWaiters'
            })

}]);
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                try {
                    scope.$apply(function () {

                        modelSetter(scope, element[0].files[0]);
                        console.log(scope)
                    });
                }catch(e) {

                }
            });
        }
    };
}]);
app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
app.controller("hotels",function($scope,$http,$location,$localStorage){

        $scope.dated = dateAndTimeFormat;
        $scope.getData = function(){

            $http({
                method: "GET",
                url: "/getAllHotels",
            }).success(function (result) {
                console.log(result);
                console.log(result.status);
                console.log(result.status== true);
                if (result.status == true) {
                    $scope.data=result.hotels;

                } else {
                    window.location.href = '/';
                }
            })

        }

    $scope.getData();
    $scope.removingId = '';
    $scope.removeData = function(id){
        $scope.removingId = id;
        $("#confirmation").modal("show")
    }

    $scope.removeConfirmed  = function(){
        if($scope.removingId!="") {

            var fd = new FormData();
                fd.append('id',$scope.removingId);

            $http.post('/delete/hotel', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){
                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#confirmation").modal("hide");
                    window.toastr.success(data.msg);
                    $scope.getData();

                }
                else {
                    $("#confirmation").modal("hide")

                }
            })
        }

    }


});
app.controller("waiters",function($scope,$http,$location,$localStorage){

        $scope.dated = dateAndTimeFormat;
        $scope.getData = function(){

            $http({
                method: "GET",
                url: "/getAllWaiters",
            }).success(function (result) {
                console.log(result.status== true);
                if (result.status == true) {
                    $scope.data=result.waiters;

                } else {
                    window.location.href = '/';
                }
            })

        }

    $scope.getData();
    $scope.removingId = '';
    $scope.removeData = function(id){
        $scope.removingId = id;
        $("#confirmation").modal("show")
    }

    $scope.removeConfirmed  = function(){
        if($scope.removingId!="") {

            var fd = new FormData();
                fd.append('id',$scope.removingId);

            $http.post('/delete/hotel', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){
                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#confirmation").modal("hide");
                    window.toastr.success(data.msg);
                    $scope.getData();

                }
                else {
                    $("#confirmation").modal("hide")

                }
            })
        }

    }


});
app.controller("assignTablesToWaiters",function($scope,$http,$location,$localStorage){

    $scope.obj = {
        hotelId:'',
        tables:'',
        waiters:[""]
    }
    $scope.getData = function(){
    $http({
        method: "GET",
        url: "/getAllHotels",
    }).success(function (result) {
        if (result.status == true) {
            $scope.hotels=result.hotels;
        } else {
            window.location.href = '/';
        }
    });

}
    $scope.getData();
    $scope.getWaiter = function(){
        $http({
            method: "GET",
            url: "/getWaitersByHotel/?hotelId="+$scope.obj.hotelId,
        }).success(function (result) {
            if (result.status == true) {
                $scope.waiters=result.waiters;
            } else {
                window.location.href = '/';
            }
        });
    }

    $scope.save=function(){

        if(!$scope.obj.hotelId){
            window.toastr.warning("Please Select Hotel")
            return false;
        }
        if(!$scope.obj.tables){
            window.toastr.warning("Please Enter No. Of Tables")
            return false;
        }

        if(!$scope.obj.waiters.length){
            window.toastr.warning("Please select Waiters")
            return false;
        }
        console.log($scope.obj.waiters);

        $http({
            url: '/generateQrCodeForTables',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            data: $scope.obj
        }).success(function(result){
            console.log(result);
                $location.path('assignTablesToWaiters')
                window.toastr.success(result.msg)
            })
            .error(function(result){
                window.toastr.warning(result.msg)
            });



    }

});
app.controller("add-hotel",function($scope,$http,$location,$localStorage){

    $scope.heading = 'Add new Hotel';
    $scope.hotel = {
        name:'',
        email:'',
        address:'',
        logo:''
        }

    $scope.save=function(){
        var fd = new FormData();
        console.log("save called 1")
        for(var k in $scope.hotel){
            if(!$scope.hotel[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, $scope.hotel[k]);
        }
        $http.post('/createHotel', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('hotels')
                window.toastr.success(result.msg)
            })
            .error(function(result){
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("add-waiter",function($scope,$http,$location,$localStorage){

        $scope.heading = 'Add New Waiter'
        $scope.dated = dateAndTimeFormat;
        $scope.getData = function(){

            $http({
                method: "GET",
                url: "/getAllHotels",
            }).success(function (result) {
                if (result.status == true) {
                    $scope.hotels=result.hotels;

                } else {
                    window.location.href = '/';
                }
            })

        }

        $scope.getData();

    $scope.waiter= {
        name:'',
        age:'',
        phone:'',
        hotelId:'',
    }

    $scope.save=function(){

        var fd = new FormData();

        if(!$scope.waiter.name){
            window.toastr.warning("Please provide Waiter name")
            return false;
        }

        if(!$scope.waiter.phone){
            window.toastr.warning("Please provide Phone Number")
            return false;
        }

        if(!$scope.waiter.hotelId){
            window.toastr.warning("Please select Hotel")
            return false;
        }


        for(var k in $scope.waiter){
            fd.append(k, $scope.waiter[k]);
        }

        $http.post('/createWaiter', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('waiters');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                window.toastr.warning(result.msg)
            });



    }

});


function dateAndTimeFormat(date){
    date = new Date(date)
    var month = date.getMonth()+1
    if(month<10){
        month = '0'+month;
    }
    var day = (date.getDate())
    if(day<10){
        day = '0'+day;
    }

    var hrs = date.getHours()

    if(hrs<10){
        hrs = '0'+hrs;
    }
    var min = date.getMinutes()
    if(min<10){
        min = '0'+min;
    }

//	date.setDate(date.getDate()+adds)
    return date.getFullYear()+"-"+month+"-"+day+" "+hrs+":"+min;
//	return Math.ceil(date.getTime()/1000)
}
function dateFormat(date){
    date = new Date(date)
    var month = date.getMonth()+1
    if(month<10){
        month = '0'+month;
    }
    var day = (date.getDate())
    if(day<10){
        day = '0'+day;
    }

    return date.getFullYear()+"-"+month+"-"+day ;
}
