
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
            .state("users",{
                url:"/users",
                templateUrl:"/js/templates/users.html",
                controller:'users'
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
            .state("edit-user",{
            url:"/user/{id}",
            templateUrl:"/js/templates/edit-user.html",
            controller:'edit-user'
            })
            .state("add-hotel",{
            url:"/add-hotel",
            templateUrl:"/js/templates/add-hotel.html",
            controller:'add-hotel'
            })
            .state("add-user",{
            url:"/add-user",
            templateUrl:"/js/templates/add-user.html",
            controller:'add-user'
            })
            .state("add-table",{
                url:"/add-table",
                templateUrl:"/js/templates/add-table.html",
                controller:'add-table'
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
app.controller("hotels",function($scope,$http,$location,$localStorage){

        $scope.dated = dateAndTimeFormat;
        $scope.getData = function(){

            $http({
                method: "GET",
                url: "/getAllHotels",
            }).success(function (result) {
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
app.controller("users",function($scope,$http,$location,$localStorage){

    $scope.dated = dateAndTimeFormat;
    $scope.getData = function(){
            $http({
                method: "GET",
                url: "/getAllUsers",
            }).success(function (result) {
                if (result.status == true) {
                    $scope.data=result.users;
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

            $http.post('/delete/user', fd,{
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
                    window.toastr.warning(data.msg);
                    $("#confirmation").modal("hide")

                }
            })
        }

    }


});
app.controller("qrCodes",function($scope,$http,$location,$localStorage){

        $scope.dated = dateAndTimeFormat;
        $scope.getData = function(){

            $http({
                method: "GET",
                url: "/getAllQrCodeImagesDetail",
            }).success(function (result) {
                console.log(result);
                console.log(result.status);
                console.log(result.status== true);
                if (result.status == true) {
                    $scope.data=result.newHotelArr;

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
        waiters:[]
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
                $location.path('hotels')
                window.toastr.success(result.msg);
            })
            .error(function(result){
                window.toastr.warning(result.msg)
            });



    }

});
app.controller("add-hotel",function($scope,$http,$location,$localStorage){

    $scope.heading = 'Add New Hotel';
    $scope.hotel = {
        name:'',
        email:'',
        address:'',
        phone:'',
        logo:'',
        menue:'',
        }

    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.hotel){
            if(!$scope.hotel[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, $scope.hotel[k]);
        }
        var div = document.getElementById('waitSpinner');
        div.style.visibility = 'visible';
        $http.post('/createHotel', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                div.style.visibility = 'hidden';
                $location.path('hotels');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                div.style.visibility = 'hidden';
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("add-user",function($scope,$http,$location,$localStorage){

    $scope.heading = 'Add New User';
    $scope.user = {
        name:'',
        email:'',
        password:'',
        hotelId:'',
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
        $http({
            method: "GET",
            url: "/getAllTypes",
        }).success(function (result) {
            if (result.status == true) {
                $scope.types=result.types;

            } else {
                window.location.href = '/';
            }
        });
    }
    $scope.getData();
    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.user){
            if(!$scope.user[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, $scope.user[k]);
        }
        $http.post('/addUser', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('users');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("edit-hotel",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.heading = 'Update Hotel';
    $scope.hotel = {
        name:'',
        email:'',
        address:'',
        phone:'',
        logo:'',
        menue:''
    }

    $scope.getData = function(){

        $http({
            method: "GET",
            url: "/hotel/"+$stateParams.id,
        }).success(function (result) {
            if (result.status == true) {
                var data =result.hotel;
                $scope.hotel.name=data.name;
                $scope.hotel.email =data.email;
                $scope.hotel.address=data.address;
                $scope.hotel.phone = data.phone;
                $scope.hotel.logo = data.logo;
                $scope.hotel.menue = data.menue;
                console.log($scope.hotel);
            } else {
                window.location.href = '/';
            }
        });
    }
    $scope.getData();

    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.hotel){
            if(!$scope.hotel[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, $scope.hotel[k]);
        }
        var div = document.getElementById('waitSpinner');
        div.style.visibility = 'visible';
        $http.put('/updateHotel/'+$stateParams.id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                div.style.visibility = 'hidden';
                $location.path( 'hotels');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                div.style.visibility = 'hidden';
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("edit-user",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.heading = 'Update User';
    $scope.user = {
        name:'',
        email:'',
        hotelId:''
    }

    $scope.getData = function(){
        $http({
            method: "GET",
            url: "/user/"+$stateParams.id,
        }).success(function (result) {
            if (result.status == true) {
                var data =result.user;
                $scope.user.name=data.name;
                $scope.user.email =data.email;
                $scope.user.hotelId = data.hotelId;
            } else {
                window.location.href = '/';
            }
        });

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

    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.user){
            if(!$scope.user[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, $scope.user[k]);
        }

        $http.put('/updateUser/'+$stateParams.id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path( 'users');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("add-table",function($scope,$http,$location,$localStorage){

        $scope.heading = 'Add Table';
        $scope.tables = [];
        $scope.showTables=function(){
        console.log("$scope.hotel.hotelId");
        console.log($scope.hotel.hotelId);

        if(!$scope.hotel.hotelId){
            window.toastr.warning("Please Select Hotel")
            return false;
        }

        $http({
            method: "GET",
            url: "/hotel/"+$scope.hotel.hotelId,
        }).success(function (result) {
            if (result.status == true) {
                $scope.tables=result.hotel.tables;
            } else {
                window.location.href = '/';
            }
        });
    }
        $scope.hotel= {
            hotelId:'',
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
            })

        }
        $scope.getData();

        $scope.addTableInHotel = function(){
            console.log("$scope.hotel.hotelId");
            console.log($scope.hotel.hotelId);

            if(!$scope.hotel.hotelId){
                window.toastr.warning("Please Select Hotel")
                return false;
            }

            var fd = new FormData();
            for(var k in $scope.hotel){
                fd.append(k, $scope.hotel[k]);
            }

            var div = document.getElementById('waitSpinner');
            div.style.visibility = 'visible';
            $http.post('/addTable', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .success(function(result){
                    div.style.visibility = 'hidden';
                    window.toastr.success(result.msg);
                    $scope.showTables();
                })
                .error(function(result){
                    div.style.visibility = 'hidden';
                    window.toastr.warning(result.msg)
                });
        }

        $scope.table = {};
        $scope.update = function(table){
            console.log(table);
            $scope.table._id = table._id;
            $scope.table.name = table.name;
            $("#update").modal("show")
        }

        $scope.updateTableName = function(){
        $http({
            url: '/updateTableName',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            data: $scope.table
        }).success(function (data) {
            if (data.status) {
                window.toastr.success(data.msg);
                $scope.showTables();
                $("#update").modal("hide")
            }
            else {
                window.toastr.warning(data.message)

            }
        })


    }



    //     $scope.showTables=function(){
    //
    //     var fd = new FormData();
    //     if(!$scope.waiter.name){
    //         window.toastr.warning("Please provide Waiter name")
    //         return false;
    //     }
    //
    //     if(!$scope.waiter.phone){
    //         window.toastr.warning("Please provide Phone Number")
    //         return false;
    //     }
    //
    //     if(!$scope.waiter.hotelId){
    //         window.toastr.warning("Please select Hotel")
    //         return false;
    //     }
    //
    //
    //     for(var k in $scope.waiter){
    //         fd.append(k, $scope.waiter[k]);
    //     }
    //
    //     $http.post('/createWaiter', fd, {
    //         transformRequest: angular.identity,
    //         headers: {'Content-Type': undefined}
    //     })
    //         .success(function(result){
    //             $location.path('waiters');
    //             window.toastr.success(result.msg)
    //         })
    //         .error(function(result){
    //             window.toastr.warning(result.msg)
    //         });
    //
    //
    //
    // }

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
