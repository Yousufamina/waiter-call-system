
var app = angular.module('stoneApp', ['ui.bootstrap',"ui.router",'angular-loading-bar','ngStorage']);

app.config(["$stateProvider","$urlRouterProvider","$httpProvider",function(t,e)
{
    e.otherwise("/serviceCall"),
        t
            .state("serviceCall",{
                url:"/serviceCall",
                templateUrl:"/js/templates/serviceCall.html",
                controller:'serviceCall'
            })

}]);

app.controller("serviceCall",function($scope,$http,$location,$localStorage){

    $scope.dated = dateFormat;
    $scope.time = TimeFormat;
    $scope.getData = function(){
        $http({
            method: "GET",
            url: "/getAllServiceCalls",
        }).success(function (result) {
            if (result.status == true) {
                $scope.data = result.calls;
            } else {
                window.location.href = '/';
            }
        })
    }

    setInterval(function() {
        $scope.getData();
    }, 2000);

    $scope.getData();
    $scope.removingId = '';
    $scope.removeData = function(id){
        $scope.removingId = id;
        $("#confirmation").modal("show")
    }
    $scope.completeService = function(id){
        $scope.removingId = id;
        $("#completeStatus").modal("show")
    }
    $scope.clearTable = function(id){
        $scope.removingId = id;
        $("#clearTable").modal("show")
    }

    $scope.removeConfirmed  = function(){
        if($scope.removingId!="") {

            var fd = new FormData();
            fd.append('id',$scope.removingId);

            $http.post('/closeCall', fd,{
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
    $scope.completeServiceConfirmed  = function(){
        if($scope.removingId!="") {

            var fd = new FormData();
            fd.append('id',$scope.removingId);

            $http.post('/completeCall', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){
                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#completeStatus").modal("hide");
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
    $scope.clearTableConfirmed  = function(){
        if($scope.removingId!="") {

            var fd = new FormData();
            fd.append('id',$scope.removingId);

            $http.post('/clearTable', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){
                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#clearTable").modal("hide");
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

    return date.getFullYear()+"-"+month+"-"+day;
}

function TimeFormat(date){
    date = new Date(date)
    var month = date.getMonth()+1
    if(month<10){
        month = '0'+month;
    }
    var day = (date.getDate())
    if(day<10){
        day = '0'+day;
    }

    var hours = date.getHours()

    var newformat = hours >= 12 ? 'PM' : 'AM';

    // Find current hour in AM-PM Format
    hours = hours % 12;

    // To display "0" as "12"
    hours = hours ? hours : 12;

    var min = date.getMinutes()
    if(min<10){
        min = '0'+min;
    }

    return hours+":"+min +' ' + newformat;;
}
// function dateFormat(date){
//     date = new Date(date)
//     var month = date.getMonth()+1
//     if(month<10){
//         month = '0'+month;
//     }
//     var day = (date.getDate())
//     if(day<10){
//         day = '0'+day;
//     }
//
//     return date.getFullYear()+"-"+month+"-"+day ;
// }
