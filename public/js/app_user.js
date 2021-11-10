
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

    $scope.dated = dateAndTimeFormat;
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

    $scope.removeConfirmed  = function(){
        if($scope.removingId!="") {

            var fd = new FormData();
            fd.append('id',$scope.removingId);

            $http.post('/endCall', fd,{
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
