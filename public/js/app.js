
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
            url:"/leagues/{id}",
            templateUrl:"/js/templates/add-leagues.html",
            controller:'edit-leagues'
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
            .state("add-team",{
            url:"/add-team/{id}",
            templateUrl:"/js/templates/add-team.html",
            controller:'add-team'
            })
            .state("add-teams",{
            url:"/add-teams",
            templateUrl:"/js/templates/add-teams.html",
            controller:'add-teams'
            })
            .state("edit-teams",{
                url:"/teams/{id}",
                templateUrl:"/js/templates/add-teams.html",
                controller:'edit-teams'
            })
            .state("teams",{
            url:"/teams",
            templateUrl:"/js/templates/teams.html",
            controller:'teams'
            })
            .state("matches",{
            url:"/matches",
            templateUrl:"/js/templates/matches.html",
            controller:'matches'
            })
            .state("add-matches",{
            url:"/add-matches",
            templateUrl:"/js/templates/add-match.html",
            controller:'add-matches'
            })
            .state("edit-match",{
            url:"/edit-match/{id}",
            templateUrl:"/js/templates/add-match.html",
            controller:'edit-matches'
            })
            .state("configs",{
            url:"/configs",
            templateUrl:"/js/templates/config.html",
            controller:'configs'
            })
            .state("notification",{
                url:"/notification",
                templateUrl:"/js/templates/sendNotification.html",
                controller:'sendNotification'
            })
            .state("sponsors",{
                url:"/sponsors",
                templateUrl:"/js/templates/sponsors.html",
                controller:'sponsors'
            })
            .state("add-sponsors",{
                url:"/add-sponsors",
                templateUrl:"/js/templates/add-sponsors.html",
                controller:'add-sponsors'
            })
            .state("edit-sponsors",{
                url:"/sponsors/{id}",
                templateUrl:"/js/templates/add-sponsors.html",
                controller:'edit-sponsors'
            })
            .state("banners",{
                url:"/banners",
                templateUrl:"/js/templates/banners.html",
                controller:'banners'
            })
            .state("add-banners",{
                url:"/add-banners",
                templateUrl:"/js/templates/add-banners.html",
                controller:'add-banners'
            })
            .state("edit-banners",{
                url:"/banners/{id}",
                templateUrl:"/js/templates/add-banners.html",
                controller:'edit-banners'
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
app.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9]/g, '');

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits,10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});
app.directive('onlyPrize', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    //           var digits = val.replace(/[^0-9\.]/g, '');
                    var digits = val.replace(',', '.').replace(/[^\d\.]/g, "").replace(/\./, "x").replace(/\./g, "").replace(/x/, ".");

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseFloat(digits,10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});
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
app.controller("leagues",function($scope,$http,$location,$localStorage){

        $scope.dated = dateAndTimeFormat;
        $scope.getData = function(){

            $http({
                method: "GET",
                url: "/admin/leagues",
            }).success(function (result) {
                if (result.status == true) {
                    $scope.data=result.data;

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



            $http.delete('/admin/leagues/'+$scope.removingId, fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){

                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#confirmation").modal("hide")
                    window.toastr.success(data.message);
                    $location.path('leagues');
                }
                else {
                    $("#confirmation").modal("hide")

                }
            })
        }

    }


});
app.controller("teams",function($scope,$http,$location,$localStorage){

        $scope.dated = dateAndTimeFormat;
        $scope.getData = function(){

            $http({
                method: "GET",
                url: "/admin/teams",
            }).success(function (result) {
                if (result.status == true) {
                    $scope.data=result.data;

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



            $http.delete('/admin/teams/'+$scope.removingId, fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){

                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#confirmation").modal("hide")
                    window.toastr.success(data.message)
                }
                else {
                    $("#confirmation").modal("hide")

                }
            })
        }

    }


});
app.controller("add-hotel",function($scope,$http,$location,$localStorage){

        $scope.heading = 'Add new Hotel'


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
app.controller("add-teams",function($scope,$http,$location,$localStorage){

        $scope.heading = 'Add new Teams'
        $scope.dated = dateAndTimeFormat;
        $scope.getData = function(){

            $http({
                method: "GET",
                url: "/admin/sports",
            }).success(function (result) {
                if (result.status == true) {
                    $scope.sports=result.data;

                } else {
                    window.location.href = '/';
                }
            })

        }

        $scope.getData();

    $scope.team= {
        name:'',
        sport_id:'',
        image:'',
        country:'',
    }

    $scope.save=function(){

        var fd = new FormData();

        if(!$scope.team.name){
            window.toastr.warning("Please provide team name")
            return false;
        }

        if(!$scope.team.sport_id){
            window.toastr.warning("Please select sports")
            return false;
        }

        console.log($scope.team.image)
        if(!$scope.team.image){
            window.toastr.warning("Please upload image")
            return false;
        }

        for(var k in $scope.team){
            fd.append(k, $scope.team[k]);
        }

        $http.post('/admin/teams', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('teams')
                window.toastr.success(result.message)
            })
            .error(function(result){
                window.toastr.warning(result.message)
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
app.controller("edit-teams",function($scope,$http,$location,$localStorage,$stateParams){

        $scope.heading = 'Edit Team'
        $scope.dated = dateAndTimeFormat;
        $scope.team= {
            name:'',
            sport_id:'',
            image:'',
            country:'',
        }

    $scope.getData = function(){
            $http({
                method: "GET",
                url: "/admin/sports",
            }).success(function (result) {
                if (result.status == true) {
                    $scope.sports=result.data;

                } else {
                    window.location.href = '/';
                }
            });
            $http({
                method: "GET",
                url: "/admin/teams/"+$stateParams.id,
            }).success(function (result) {
                if (result.status == true) {
                    console.log(result);
                    $scope.team=result.data;
                    console.log($scope.team)
                    $scope.team.sport_id=$scope.team.sport_id.toString();
                    $scope.team.image= $scope.team.image;
                    // $scope.team.country=  $scope.team.country;

                } else {
                    window.location.href = '/';
                }
            });
        }
        $scope.getData();
    $scope.save=function(){

        var fd = new FormData();

        if(!$scope.team.name){
            window.toastr.warning("Please provide team name")
            return false;
        }

        if(!$scope.team.sport_id){
            window.toastr.warning("Please select sports")
            return false;
        }

        console.log($scope.team.image)
        if(!$scope.team.image){
            window.toastr.warning("Please upload image")
            return false;
        }

        for(var k in $scope.team){
            fd.append(k, $scope.team[k]);
        }


        $http.put('/admin/teams/'+$stateParams.id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('teams')
                window.toastr.success(result.message)
            })
            .error(function(result){
                window.toastr.warning(result.message)
            });
    }

});
app.controller("edit-leagues",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.heading = 'Edit league'
    $scope.league = {
        title:'',
        start_date:new Date(),
        end_date:new Date(),
        status:'active',
        sport_id:'',
        image_active:'',
        image_inactive:'',
        color:''
    }
        $scope.dated = dateAndTimeFormat;
        $scope.getData = function(){
            $http({
                method: "GET",
                url: "/admin/sports",
            }).success(function (result) {
                if (result.status == true) {
                    $scope.sports=result.data;

                } else {
                    window.location.href = '/';
                }
            });
            $http({
                method: "GET",
                url: "/admin/leagues/"+$stateParams.id,
            }).success(function (result) {
                if (result.status == true) {
                    $scope.league=result.data;
                    $scope.league.status=$scope.league.league_status;
                    $scope.league.sport_id=$scope.league.sport_id.toString();
                    $scope.league.start_date=new Date($scope.league.start_date);
                    $scope.league.end_date=new Date($scope.league.end_date);

                } else {
                    window.location.href = '/';
                }
            })
        }
        $scope.getData();
        $scope.save=function(){
        var fd = new FormData();
        console.log("save league ")
        console.log($scope.league)
        for(var k in $scope.league){
            console.log(k)
            console.log($scope.league[k])
            if(!$scope.league[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, $scope.league[k]);
        }

        $http.put('/admin/leagues/'+$stateParams.id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('leagues')
                window.toastr.success(result.message)
            })
            .error(function(result){
                window.toastr.warning(result.message)
            });



    }

});
app.controller("add-matches",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.hours = [];
    for(var i = 0;i<48;i++)
    {
        var hours = Math.floor((i*30) / 60);
        var minutes = (i*30) % 60;
        var ampm = 'AM';
        if(hours>12){
            hours -= 12;
            ampm = 'PM'
        }
        if(minutes<10)
        {
            minutes = '0'+minutes;
        }
        if(hours<10)
        {
            hours = '0'+hours;
        }

        $scope.hours.push({
            value:(i*30),
            text:hours+":"+minutes+" "+ampm
        })

    }
    $scope.match= {
        team_b_id: 'b',
        team_a_id: 'a',
        stronger_team_id: 'a',
        series_id: 1,
        start_date: new Date(),
        end_date: new Date(),
        venue: '',
        result: '',
        group_info: '',
        video_link: '',
        audio_link: ''
    }

        $scope.countryTz = [["AF","Afghanistan","Asia/Kabul","+04:30"],
        ["AX","Aland Islands","Europe/Mariehamn","+02:00"],
        ["AL","Albania","Europe/Tirane","+01:00"],
        ["DZ","Algeria","Africa/Algiers","+01:00"],
        ["AS","American Samoa","Pacific/Pago_Pago","-11:00"],
        ["AD","Andorra","Europe/Andorra","+01:00"],
        ["AO","Angola","Africa/Luanda","+01:00"],
        ["AI","Anguilla","America/Anguilla","-04:00"],
        ["AQ","Antarctica","Antarctica/Casey","+11:00"],
        ["AQ","Antarctica","Antarctica/Davis","+07:00"],
        ["AQ","Antarctica","Antarctica/DumontDUrville","+10:00"],
        ["AQ","Antarctica","Antarctica/Mawson","+05:00"],
        ["AQ","Antarctica","Antarctica/McMurdo","+13:00"],
        ["AQ","Antarctica","Antarctica/Palmer","-03:00"],
        ["AQ","Antarctica","Antarctica/Rothera","-03:00"],
        ["AQ","Antarctica","Antarctica/Syowa","+03:00"],
        ["AQ","Antarctica","Antarctica/Troll","UTC"],
        ["AQ","Antarctica","Antarctica/Vostok","+06:00"],
        ["AG","Antigua and Barbuda","America/Antigua","-04:00"],
        ["AR","Argentina","America/Argentina/Buenos_Aires","-03:00"],
        ["AR","Argentina","America/Argentina/Catamarca","-03:00"],
        ["AR","Argentina","America/Argentina/Cordoba","-03:00"],
        ["AR","Argentina","America/Argentina/Jujuy","-03:00"],
        ["AR","Argentina","America/Argentina/La_Rioja","-03:00"],
        ["AR","Argentina","America/Argentina/Mendoza","-03:00"],
        ["AR","Argentina","America/Argentina/Rio_Gallegos","-03:00"],
        ["AR","Argentina","America/Argentina/Salta","-03:00"],
        ["AR","Argentina","America/Argentina/San_Juan","-03:00"],
        ["AR","Argentina","America/Argentina/San_Luis","-03:00"],
        ["AR","Argentina","America/Argentina/Tucuman","-03:00"],
        ["AR","Argentina","America/Argentina/Ushuaia","-03:00"],
        ["AM","Armenia","Asia/Yerevan","+04:00"],
        ["AW","Aruba","America/Aruba","-04:00"],
        ["AU","Australia","Antarctica/Macquarie","+11:00"],
        ["AU","Australia","Australia/Adelaide","+10:30"],
        ["AU","Australia","Australia/Brisbane","+10:00"],
        ["AU","Australia","Australia/Broken_Hill","+10:30"],
        ["AU","Australia","Australia/Currie","+11:00"],
        ["AU","Australia","Australia/Darwin","+09:30"],
        ["AU","Australia","Australia/Eucla","+08:45"],
        ["AU","Australia","Australia/Hobart","+11:00"],
        ["AU","Australia","Australia/Lindeman","+10:00"],
        ["AU","Australia","Australia/Lord_Howe","+11:00"],
        ["AU","Australia","Australia/Melbourne","+11:00"],
        ["AU","Australia","Australia/Perth","+08:00"],
        ["AU","Australia","Australia/Sydney","+11:00"],
        ["AT","Austria","Europe/Vienna","+01:00"],
        ["AZ","Azerbaijan","Asia/Baku","+04:00"],
        ["BS","Bahamas","America/Nassau","-05:00"],
        ["BH","Bahrain","Asia/Bahrain","+04:00"],
        ["BD","Bangladesh","Asia/Dhaka","+06:00"],
        ["BB","Barbados","America/Barbados","-04:00"],
        ["BY","Belarus","Europe/Minsk","+03:00"],
        ["BE","Belgium","Europe/Brussels","+01:00"],
        ["BZ","Belize","America/Belize","-06:00"],
        ["BJ","Benin","Africa/Porto-Novo","+01:00"],
        ["BM","Bermuda","Atlantic/Bermuda","-04:00"],
        ["BT","Bhutan","Asia/Thimphu","+06:00"],
        ["BO","Bolivia","America/La_Paz","-04:00"],
        ["BQ","Bonaire Saint Eustatius and Saba","America/Kralendijk","-04:00"],
        ["BA","Bosnia and Herzegovina","Europe/Sarajevo","+01:00"],
        ["BW","Botswana","Africa/Gaborone","+02:00"],
        ["BR","Brazil","America/Araguaina","-03:00"],
        ["BR","Brazil","America/Bahia","-03:00"],
        ["BR","Brazil","America/Belem","-03:00"],
        ["BR","Brazil","America/Boa_Vista","-04:00"],
        ["BR","Brazil","America/Campo_Grande","-03:00"],
        ["BR","Brazil","America/Cuiaba","-03:00"],
        ["BR","Brazil","America/Eirunepe","-05:00"],
        ["BR","Brazil","America/Fortaleza","-03:00"],
        ["BR","Brazil","America/Maceio","-03:00"],
        ["BR","Brazil","America/Manaus","-04:00"],
        ["BR","Brazil","America/Noronha","-02:00"],
        ["BR","Brazil","America/Porto_Velho","-04:00"],
        ["BR","Brazil","America/Recife","-03:00"],
        ["BR","Brazil","America/Rio_Branco","-05:00"],
        ["BR","Brazil","America/Santarem","-03:00"],
        ["BR","Brazil","America/Sao_Paulo","-02:00"],
        ["IO","British Indian Ocean Territory","Indian/Chagos","+06:00"],
        ["VG","British Virgin Islands","America/Tortola","-04:00"],
        ["BN","Brunei","Asia/Brunei","+08:00"],
        ["BG","Bulgaria","Europe/Sofia","+02:00"],
        ["BF","Burkina Faso","Africa/Ouagadougou","UTC"],
        ["BI","Burundi","Africa/Bujumbura","+02:00"],
        ["KH","Cambodia","Asia/Phnom_Penh","+07:00"],
        ["CM","Cameroon","Africa/Douala","+01:00"],
        ["CA","Canada","America/Atikokan","-05:00"],
        ["CA","Canada","America/Blanc-Sablon","-04:00"],
        ["CA","Canada","America/Cambridge_Bay","-07:00"],
        ["CA","Canada","America/Creston","-07:00"],
        ["CA","Canada","America/Dawson","-08:00"],
        ["CA","Canada","America/Dawson_Creek","-07:00"],
        ["CA","Canada","America/Edmonton","-07:00"],
        ["CA","Canada","America/Fort_Nelson","-07:00"],
        ["CA","Canada","America/Glace_Bay","-04:00"],
        ["CA","Canada","America/Goose_Bay","-04:00"],
        ["CA","Canada","America/Halifax","-04:00"],
        ["CA","Canada","America/Inuvik","-07:00"],
        ["CA","Canada","America/Iqaluit","-05:00"],
        ["CA","Canada","America/Moncton","-04:00"],
        ["CA","Canada","America/Nipigon","-05:00"],
        ["CA","Canada","America/Pangnirtung","-05:00"],
        ["CA","Canada","America/Rainy_River","-06:00"],
        ["CA","Canada","America/Rankin_Inlet","-06:00"],
        ["CA","Canada","America/Regina","-06:00"],
        ["CA","Canada","America/Resolute","-06:00"],
        ["CA","Canada","America/St_Johns","-03:30"],
        ["CA","Canada","America/Swift_Current","-06:00"],
        ["CA","Canada","America/Thunder_Bay","-05:00"],
        ["CA","Canada","America/Toronto","-05:00"],
        ["CA","Canada","America/Vancouver","-08:00"],
        ["CA","Canada","America/Whitehorse","-08:00"],
        ["CA","Canada","America/Winnipeg","-06:00"],
        ["CA","Canada","America/Yellowknife","-07:00"],
        ["CV","Cape Verde","Atlantic/Cape_Verde","-01:00"],
        ["KY","Cayman Islands","America/Cayman","-05:00"],
        ["CF","Central African Republic","Africa/Bangui","+01:00"],
        ["TD","Chad","Africa/Ndjamena","+01:00"],
        ["CL","Chile","America/Punta_Arenas","-03:00"],
        ["CL","Chile","America/Santiago","-03:00"],
        ["CL","Chile","Pacific/Easter","-05:00"],
        ["CN","China","Asia/Shanghai","+08:00"],
        ["CN","China","Asia/Urumqi","+06:00"],
        ["CX","Christmas Island","Indian/Christmas","+07:00"],
        ["CC","Cocos Islands","Indian/Cocos","+06:30"],
        ["CO","Colombia","America/Bogota","-05:00"],
        ["KM","Comoros","Indian/Comoro","+03:00"],
        ["CK","Cook Islands","Pacific/Rarotonga","-10:00"],
        ["CR","Costa Rica","America/Costa_Rica","-06:00"],
        ["HR","Croatia","Europe/Zagreb","+01:00"],
        ["CU","Cuba","America/Havana","-05:00"],
        ["CW","Curaçao","America/Curacao","-04:00"],
        ["CY","Cyprus","Asia/Famagusta","+03:00"],
        ["CY","Cyprus","Asia/Nicosia","+02:00"],
        ["CZ","Czech Republic","Europe/Prague","+01:00"],
        ["CD","Democratic Republic of the Congo","Africa/Kinshasa","+01:00"],
        ["CD","Democratic Republic of the Congo","Africa/Lubumbashi","+02:00"],
        ["DK","Denmark","Europe/Copenhagen","+01:00"],
        ["DJ","Djibouti","Africa/Djibouti","+03:00"],
        ["DM","Dominica","America/Dominica","-04:00"],
        ["DO","Dominican Republic","America/Santo_Domingo","-04:00"],
        ["TL","East Timor","Asia/Dili","+09:00"],
        ["EC","Ecuador","America/Guayaquil","-05:00"],
        ["EC","Ecuador","Pacific/Galapagos","-06:00"],
        ["EG","Egypt","Africa/Cairo","+02:00"],
        ["SV","El Salvador","America/El_Salvador","-06:00"],
        ["GQ","Equatorial Guinea","Africa/Malabo","+01:00"],
        ["ER","Eritrea","Africa/Asmara","+03:00"],
        ["EE","Estonia","Europe/Tallinn","+02:00"],
        ["ET","Ethiopia","Africa/Addis_Ababa","+03:00"],
        ["FK","Falkland Islands","Atlantic/Stanley","-03:00"],
        ["FO","Faroe Islands","Atlantic/Faroe","UTC"],
        ["FJ","Fiji","Pacific/Fiji","+13:00"],
        ["FI","Finland","Europe/Helsinki","+02:00"],
        ["FR","France","Europe/Paris","+01:00"],
        ["GF","French Guiana","America/Cayenne","-03:00"],
        ["PF","French Polynesia","Pacific/Gambier","-09:00"],
        ["PF","French Polynesia","Pacific/Marquesas","-09:30"],
        ["PF","French Polynesia","Pacific/Tahiti","-10:00"],
        ["TF","French Southern Territories","Indian/Kerguelen","+05:00"],
        ["GA","Gabon","Africa/Libreville","+01:00"],
        ["GM","Gambia","Africa/Banjul","UTC"],
        ["GE","Georgia","Asia/Tbilisi","+04:00"],
        ["DE","Germany","Europe/Berlin","+01:00"],
        ["DE","Germany","Europe/Busingen","+01:00"],
        ["GH","Ghana","Africa/Accra","UTC"],
        ["GI","Gibraltar","Europe/Gibraltar","+01:00"],
        ["GR","Greece","Europe/Athens","+02:00"],
        ["GL","Greenland","America/Danmarkshavn","UTC"],
        ["GL","Greenland","America/Godthab","-03:00"],
        ["GL","Greenland","America/Scoresbysund","-01:00"],
        ["GL","Greenland","America/Thule","-04:00"],
        ["GD","Grenada","America/Grenada","-04:00"],
        ["GP","Guadeloupe","America/Guadeloupe","-04:00"],
        ["GU","Guam","Pacific/Guam","+10:00"],
        ["GT","Guatemala","America/Guatemala","-06:00"],
        ["GG","Guernsey","Europe/Guernsey","UTC"],
        ["GN","Guinea","Africa/Conakry","UTC"],
        ["GW","Guinea-Bissau","Africa/Bissau","UTC"],
        ["GY","Guyana","America/Guyana","-04:00"],
        ["HT","Haiti","America/Port-au-Prince","-05:00"],
        ["HN","Honduras","America/Tegucigalpa","-06:00"],
        ["HK","Hong Kong","Asia/Hong_Kong","+08:00"],
        ["HU","Hungary","Europe/Budapest","+01:00"],
        ["IS","Iceland","Atlantic/Reykjavik","UTC"],
        ["IN","India","Asia/Kolkata","+05:30"],
        ["ID","Indonesia","Asia/Jakarta","+07:00"],
        ["ID","Indonesia","Asia/Jayapura","+09:00"],
        ["ID","Indonesia","Asia/Makassar","+08:00"],
        ["ID","Indonesia","Asia/Pontianak","+07:00"],
        ["IR","Iran","Asia/Tehran","+03:30"],
        ["IQ","Iraq","Asia/Baghdad","+03:00"],
        ["IE","Ireland","Europe/Dublin","UTC"],
        ["IM","Isle of Man","Europe/Isle_of_Man","UTC"],
        ["IL","Israel","Asia/Jerusalem","+02:00"],
        ["IT","Italy","Europe/Rome","+01:00"],
        ["CI","Ivory Coast","Africa/Abidjan","UTC"],
        ["JM","Jamaica","America/Jamaica","-05:00"],
        ["JP","Japan","Asia/Tokyo","+09:00"],
        ["JE","Jersey","Europe/Jersey","UTC"],
        ["JO","Jordan","Asia/Amman","+02:00"],
        ["KZ","Kazakhstan","Asia/Almaty","+06:00"],
        ["KZ","Kazakhstan","Asia/Aqtau","+05:00"],
        ["KZ","Kazakhstan","Asia/Aqtobe","+05:00"],
        ["KZ","Kazakhstan","Asia/Atyrau","+05:00"],
        ["KZ","Kazakhstan","Asia/Oral","+05:00"],
        ["KZ","Kazakhstan","Asia/Qyzylorda","+06:00"],
        ["KE","Kenya","Africa/Nairobi","+03:00"],
        ["KI","Kiribati","Pacific/Enderbury","+13:00"],
        ["KI","Kiribati","Pacific/Kiritimati","+14:00"],
        ["KI","Kiribati","Pacific/Tarawa","+12:00"],
        ["KW","Kuwait","Asia/Kuwait","+03:00"],
        ["KG","Kyrgyzstan","Asia/Bishkek","+06:00"],
        ["LA","Laos","Asia/Vientiane","+07:00"],
        ["LV","Latvia","Europe/Riga","+02:00"],
        ["LB","Lebanon","Asia/Beirut","+02:00"],
        ["LS","Lesotho","Africa/Maseru","+02:00"],
        ["LR","Liberia","Africa/Monrovia","UTC"],
        ["LY","Libya","Africa/Tripoli","+02:00"],
        ["LI","Liechtenstein","Europe/Vaduz","+01:00"],
        ["LT","Lithuania","Europe/Vilnius","+02:00"],
        ["LU","Luxembourg","Europe/Luxembourg","+01:00"],
        ["MO","Macao","Asia/Macau","+08:00"],
        ["MK","Macedonia","Europe/Skopje","+01:00"],
        ["MG","Madagascar","Indian/Antananarivo","+03:00"],
        ["MW","Malawi","Africa/Blantyre","+02:00"],
        ["MY","Malaysia","Asia/Kuala_Lumpur","+08:00"],
        ["MY","Malaysia","Asia/Kuching","+08:00"],
        ["MV","Maldives","Indian/Maldives","+05:00"],
        ["ML","Mali","Africa/Bamako","UTC"],
        ["MT","Malta","Europe/Malta","+01:00"],
        ["MH","Marshall Islands","Pacific/Kwajalein","+12:00"],
        ["MH","Marshall Islands","Pacific/Majuro","+12:00"],
        ["MQ","Martinique","America/Martinique","-04:00"],
        ["MR","Mauritania","Africa/Nouakchott","UTC"],
        ["MU","Mauritius","Indian/Mauritius","+04:00"],
        ["YT","Mayotte","Indian/Mayotte","+03:00"],
        ["MX","Mexico","America/Bahia_Banderas","-06:00"],
        ["MX","Mexico","America/Cancun","-05:00"],
        ["MX","Mexico","America/Chihuahua","-07:00"],
        ["MX","Mexico","America/Hermosillo","-07:00"],
        ["MX","Mexico","America/Matamoros","-06:00"],
        ["MX","Mexico","America/Mazatlan","-07:00"],
        ["MX","Mexico","America/Merida","-06:00"],
        ["MX","Mexico","America/Mexico_City","-06:00"],
        ["MX","Mexico","America/Monterrey","-06:00"],
        ["MX","Mexico","America/Ojinaga","-07:00"],
        ["MX","Mexico","America/Tijuana","-08:00"],
        ["FM","Micronesia","Pacific/Chuuk","+10:00"],
        ["FM","Micronesia","Pacific/Kosrae","+11:00"],
        ["FM","Micronesia","Pacific/Pohnpei","+11:00"],
        ["MD","Moldova","Europe/Chisinau","+02:00"],
        ["MC","Monaco","Europe/Monaco","+01:00"],
        ["MN","Mongolia","Asia/Choibalsan","+08:00"],
        ["MN","Mongolia","Asia/Hovd","+07:00"],
        ["MN","Mongolia","Asia/Ulaanbaatar","+08:00"],
        ["ME","Montenegro","Europe/Podgorica","+01:00"],
        ["MS","Montserrat","America/Montserrat","-04:00"],
        ["MA","Morocco","Africa/Casablanca","UTC"],
        ["MZ","Mozambique","Africa/Maputo","+02:00"],
        ["MM","Myanmar","Asia/Yangon","+06:30"],
        ["NA","Namibia","Africa/Windhoek","+02:00"],
        ["NR","Nauru","Pacific/Nauru","+12:00"],
        ["NP","Nepal","Asia/Kathmandu","+05:45"],
        ["NL","Netherlands","Europe/Amsterdam","+01:00"],
        ["NC","New Caledonia","Pacific/Noumea","+11:00"],
        ["NZ","New Zealand","Pacific/Auckland","+13:00"],
        ["NZ","New Zealand","Pacific/Chatham","+13:45"],
        ["NI","Nicaragua","America/Managua","-06:00"],
        ["NE","Niger","Africa/Niamey","+01:00"],
        ["NG","Nigeria","Africa/Lagos","+01:00"],
        ["NU","Niue","Pacific/Niue","-11:00"],
        ["NF","Norfolk Island","Pacific/Norfolk","+11:00"],
        ["KP","North Korea","Asia/Pyongyang","+08:30"],
        ["MP","Northern Mariana Islands","Pacific/Saipan","+10:00"],
        ["NO","Norway","Europe/Oslo","+01:00"],
        ["OM","Oman","Asia/Muscat","+04:00"],
        ["PK","Pakistan","Asia/Karachi","+05:00"],
        ["PW","Palau","Pacific/Palau","+09:00"],
        ["PS","Palestinian Territory","Asia/Gaza","+02:00"],
        ["PS","Palestinian Territory","Asia/Hebron","+02:00"],
        ["PA","Panama","America/Panama","-05:00"],
        ["PG","Papua New Guinea","Pacific/Bougainville","+11:00"],
        ["PG","Papua New Guinea","Pacific/Port_Moresby","+10:00"],
        ["PY","Paraguay","America/Asuncion","-03:00"],
        ["PE","Peru","America/Lima","-05:00"],
        ["PH","Philippines","Asia/Manila","+08:00"],
        ["PN","Pitcairn","Pacific/Pitcairn","-08:00"],
        ["PL","Poland","Europe/Warsaw","+01:00"],
        ["PT","Portugal","Atlantic/Azores","-01:00"],
        ["PT","Portugal","Atlantic/Madeira","UTC"],
        ["PT","Portugal","Europe/Lisbon","UTC"],
        ["PR","Puerto Rico","America/Puerto_Rico","-04:00"],
        ["QA","Qatar","Asia/Qatar","+04:00"],
        ["CG","Republic of the Congo","Africa/Brazzaville","+01:00"],
        ["RE","Reunion","Indian/Reunion","+04:00"],
        ["RO","Romania","Europe/Bucharest","+02:00"],
        ["RU","Russia","Asia/Anadyr","+12:00"],
        ["RU","Russia","Asia/Barnaul","+07:00"],
        ["RU","Russia","Asia/Chita","+09:00"],
        ["RU","Russia","Asia/Irkutsk","+08:00"],
        ["RU","Russia","Asia/Kamchatka","+12:00"],
        ["RU","Russia","Asia/Khandyga","+09:00"],
        ["RU","Russia","Asia/Krasnoyarsk","+07:00"],
        ["RU","Russia","Asia/Magadan","+11:00"],
        ["RU","Russia","Asia/Novokuznetsk","+07:00"],
        ["RU","Russia","Asia/Novosibirsk","+07:00"],
        ["RU","Russia","Asia/Omsk","+06:00"],
        ["RU","Russia","Asia/Sakhalin","+11:00"],
        ["RU","Russia","Asia/Srednekolymsk","+11:00"],
        ["RU","Russia","Asia/Tomsk","+07:00"],
        ["RU","Russia","Asia/Ust-Nera","+10:00"],
        ["RU","Russia","Asia/Vladivostok","+10:00"],
        ["RU","Russia","Asia/Yakutsk","+09:00"],
        ["RU","Russia","Asia/Yekaterinburg","+05:00"],
        ["RU","Russia","Europe/Astrakhan","+04:00"],
        ["RU","Russia","Europe/Kaliningrad","+02:00"],
        ["RU","Russia","Europe/Kirov","+03:00"],
        ["RU","Russia","Europe/Moscow","+03:00"],
        ["RU","Russia","Europe/Samara","+04:00"],
        ["RU","Russia","Europe/Saratov","+04:00"],
        ["RU","Russia","Europe/Simferopol","+03:00"],
        ["RU","Russia","Europe/Ulyanovsk","+04:00"],
        ["RU","Russia","Europe/Volgograd","+03:00"],
        ["RW","Rwanda","Africa/Kigali","+02:00"],
        ["BL","Saint Barthélemy","America/St_Barthelemy","-04:00"],
        ["SH","Saint Helena","Atlantic/St_Helena","UTC"],
        ["KN","Saint Kitts and Nevis","America/St_Kitts","-04:00"],
        ["LC","Saint Lucia","America/St_Lucia","-04:00"],
        ["MF","Saint Martin","America/Marigot","-04:00"],
        ["PM","Saint Pierre and Miquelon","America/Miquelon","-03:00"],
        ["VC","Saint Vincent and the Grenadines","America/St_Vincent","-04:00"],
        ["WS","Samoa","Pacific/Apia","+14:00"],
        ["SM","San Marino","Europe/San_Marino","+01:00"],
        ["ST","Sao Tome and Principe","Africa/Sao_Tome","UTC"],
        ["SA","Saudi Arabia","Asia/Riyadh","+03:00"],
        ["SN","Senegal","Africa/Dakar","UTC"],
        ["RS","Serbia","Europe/Belgrade","+01:00"],
        ["SC","Seychelles","Indian/Mahe","+04:00"],
        ["SL","Sierra Leone","Africa/Freetown","UTC"],
        ["SG","Singapore","Asia/Singapore","+08:00"],
        ["SX","Sint Maarten","America/Lower_Princes","-04:00"],
        ["SK","Slovakia","Europe/Bratislava","+01:00"],
        ["SI","Slovenia","Europe/Ljubljana","+01:00"],
        ["SB","Solomon Islands","Pacific/Guadalcanal","+11:00"],
        ["SO","Somalia","Africa/Mogadishu","+03:00"],
        ["ZA","South Africa","Africa/Johannesburg","+02:00"],
        ["GS","South Georgia and the South Sandwich Islands","Atlantic/South_Georgia","-02:00"],
        ["KR","South Korea","Asia/Seoul","+09:00"],
        ["SS","South Sudan","Africa/Juba","+03:00"],
        ["ES","Spain","Africa/Ceuta","+01:00"],
        ["ES","Spain","Atlantic/Canary","UTC"],
        ["ES","Spain","Europe/Madrid","+01:00"],
        ["LK","Sri Lanka","Asia/Colombo","+05:30"],
        ["SD","Sudan","Africa/Khartoum","+03:00"],
        ["SR","Suriname","America/Paramaribo","-03:00"],
        ["SJ","Svalbard and Jan Mayen","Arctic/Longyearbyen","+01:00"],
        ["SZ","Swaziland","Africa/Mbabane","+02:00"],
        ["SE","Sweden","Europe/Stockholm","+01:00"],
        ["CH","Switzerland","Europe/Zurich","+01:00"],
        ["SY","Syria","Asia/Damascus","+02:00"],
        ["TW","Taiwan","Asia/Taipei","+08:00"],
        ["TJ","Tajikistan","Asia/Dushanbe","+05:00"],
        ["TZ","Tanzania","Africa/Dar_es_Salaam","+03:00"],
        ["TH","Thailand","Asia/Bangkok","+07:00"],
        ["TG","Togo","Africa/Lome","UTC"],
        ["TK","Tokelau","Pacific/Fakaofo","+13:00"],
        ["TO","Tonga","Pacific/Tongatapu","+14:00"],
        ["TT","Trinidad and Tobago","America/Port_of_Spain","-04:00"],
        ["TN","Tunisia","Africa/Tunis","+01:00"],
        ["TR","Turkey","Europe/Istanbul","+03:00"],
        ["TM","Turkmenistan","Asia/Ashgabat","+05:00"],
        ["TC","Turks and Caicos Islands","America/Grand_Turk","-04:00"],
        ["TV","Tuvalu","Pacific/Funafuti","+12:00"],
        ["VI","U.S. Virgin Islands","America/St_Thomas","-04:00"],
        ["UG","Uganda","Africa/Kampala","+03:00"],
        ["UA","Ukraine","Europe/Kiev","+02:00"],
        ["UA","Ukraine","Europe/Uzhgorod","+02:00"],
        ["UA","Ukraine","Europe/Zaporozhye","+02:00"],
        ["AE","United Arab Emirates","Asia/Dubai","+04:00"],
        ["GB","United Kingdom","Europe/London","UTC"],
        ["US","United States","America/Adak","-10:00"],
        ["US","United States","America/Anchorage","-09:00"],
        ["US","United States","America/Boise","-07:00"],
        ["US","United States","America/Chicago","-06:00"],
        ["US","United States","America/Denver","-07:00"],
        ["US","United States","America/Detroit","-05:00"],
        ["US","United States","America/Indiana/Indianapolis","-05:00"],
        ["US","United States","America/Indiana/Knox","-06:00"],
        ["US","United States","America/Indiana/Marengo","-05:00"],
        ["US","United States","America/Indiana/Petersburg","-05:00"],
        ["US","United States","America/Indiana/Tell_City","-06:00"],
        ["US","United States","America/Indiana/Vevay","-05:00"],
        ["US","United States","America/Indiana/Vincennes","-05:00"],
        ["US","United States","America/Indiana/Winamac","-05:00"],
        ["US","United States","America/Juneau","-09:00"],
        ["US","United States","America/Kentucky/Louisville","-05:00"],
        ["US","United States","America/Kentucky/Monticello","-05:00"],
        ["US","United States","America/Los_Angeles","-08:00"],
        ["US","United States","America/Menominee","-06:00"],
        ["US","United States","America/Metlakatla","-09:00"],
        ["US","United States","America/New_York","-05:00"],
        ["US","United States","America/Nome","-09:00"],
        ["US","United States","America/North_Dakota/Beulah","-06:00"],
        ["US","United States","America/North_Dakota/Center","-06:00"],
        ["US","United States","America/North_Dakota/New_Salem","-06:00"],
        ["US","United States","America/Phoenix","-07:00"],
        ["US","United States","America/Sitka","-09:00"],
        ["US","United States","America/Yakutat","-09:00"],
        ["US","United States","Pacific/Honolulu","-10:00"],
        ["UM","United States Minor Outlying Islands","Pacific/Midway","-11:00"],
        ["UM","United States Minor Outlying Islands","Pacific/Wake","+12:00"],
        ["UY","Uruguay","America/Montevideo","-03:00"],
        ["UZ","Uzbekistan","Asia/Samarkand","+05:00"],
        ["UZ","Uzbekistan","Asia/Tashkent","+05:00"],
        ["VU","Vanuatu","Pacific/Efate","+11:00"],
        ["VA","Vatican","Europe/Vatican","+01:00"],
        ["VE","Venezuela","America/Caracas","-04:00"],
        ["VN","Vietnam","Asia/Ho_Chi_Minh","+07:00"],
        ["WF","Wallis and Futuna","Pacific/Wallis","+12:00"],
        ["EH","Western Sahara","Africa/El_Aaiun","UTC"],
        ["YE","Yemen","Asia/Aden","+03:00"],
        ["ZM","Zambia","Africa/Lusaka","+02:00"],
        ["ZW","Zimbabwe","Africa/Harare","+02:00"]];

        $scope.dated = dateAndTimeFormat;
        $scope.getTeam = function(){

                $http({
                method: "GET",
                url: "/admin/league_team/?leagueId="+$scope.match.series_id,
            }).success(function (result) {
                if (result.status == true) {
                    $scope.teams=result.data;


                }
            })
        }
        $scope.getData = function(){

            $http({
                method: "GET",
                url: "/admin/leagues",
            }).success(function (result) {
                if (result.status == true) {
                    $scope.leagues=result.data;

                } else {
                    window.location.href = '/';
                }
            })
            $http({
                method: "GET",
                url: "/admin/sports",
            }).success(function (result) {
                if (result.status == true) {
                    $scope.sports=result.data;

                } else {
                    window.location.href = '/';
                }
            })



            $http({
                method: "GET",
                url: "/admin/teams?sport_id=1",
            }).success(function (result) {
                if (result.status == true) {
                    $scope.teams=result.data;
                } else {
                    window.location.href = '/';
                }
            })
        }

        $scope.getData();

        $scope.save=function(){

        var fd = new FormData();

        var startDate = new Date($scope.match.start_date);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        $scope.match.start_date = new Date(startDate ).getTime() + (parseInt($scope.match.start_time)*60*1000);
        $scope.match.end_date = new Date($scope.match.end_date).getTime();
        for(var k in $scope.match){
            fd.append(k, $scope.match[k]);
        }

        $http.post('/admin/matches', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('matches')
                window.toastr.success(result.message)
            })
            .error(function(result){
                window.toastr.warning(result.message)
            });


    }

});
app.controller("edit-matches",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.hours = [];
    for(var i = 0;i<48;i++)
    {
        var hours = Math.floor((i*30) / 60);
        var minutes = (i*30) % 60;
        var ampm = 'AM';
        if(hours>12){
            hours -= 12;
            ampm = 'PM'
        }
        if(minutes<10)
        {
            minutes = '0'+minutes;
        }
        if(hours<10)
        {
            hours = '0'+hours;
        }

        $scope.hours.push({
            value:(i*30),
            text:hours+":"+minutes+" "+ampm
        })

    }

    $scope.countryTz = [["AF","Afghanistan","Asia/Kabul","+04:30"],
        ["AX","Aland Islands","Europe/Mariehamn","+02:00"],
        ["AL","Albania","Europe/Tirane","+01:00"],
        ["DZ","Algeria","Africa/Algiers","+01:00"],
        ["AS","American Samoa","Pacific/Pago_Pago","-11:00"],
        ["AD","Andorra","Europe/Andorra","+01:00"],
        ["AO","Angola","Africa/Luanda","+01:00"],
        ["AI","Anguilla","America/Anguilla","-04:00"],
        ["AQ","Antarctica","Antarctica/Casey","+11:00"],
        ["AQ","Antarctica","Antarctica/Davis","+07:00"],
        ["AQ","Antarctica","Antarctica/DumontDUrville","+10:00"],
        ["AQ","Antarctica","Antarctica/Mawson","+05:00"],
        ["AQ","Antarctica","Antarctica/McMurdo","+13:00"],
        ["AQ","Antarctica","Antarctica/Palmer","-03:00"],
        ["AQ","Antarctica","Antarctica/Rothera","-03:00"],
        ["AQ","Antarctica","Antarctica/Syowa","+03:00"],
        ["AQ","Antarctica","Antarctica/Troll","UTC"],
        ["AQ","Antarctica","Antarctica/Vostok","+06:00"],
        ["AG","Antigua and Barbuda","America/Antigua","-04:00"],
        ["AR","Argentina","America/Argentina/Buenos_Aires","-03:00"],
        ["AR","Argentina","America/Argentina/Catamarca","-03:00"],
        ["AR","Argentina","America/Argentina/Cordoba","-03:00"],
        ["AR","Argentina","America/Argentina/Jujuy","-03:00"],
        ["AR","Argentina","America/Argentina/La_Rioja","-03:00"],
        ["AR","Argentina","America/Argentina/Mendoza","-03:00"],
        ["AR","Argentina","America/Argentina/Rio_Gallegos","-03:00"],
        ["AR","Argentina","America/Argentina/Salta","-03:00"],
        ["AR","Argentina","America/Argentina/San_Juan","-03:00"],
        ["AR","Argentina","America/Argentina/San_Luis","-03:00"],
        ["AR","Argentina","America/Argentina/Tucuman","-03:00"],
        ["AR","Argentina","America/Argentina/Ushuaia","-03:00"],
        ["AM","Armenia","Asia/Yerevan","+04:00"],
        ["AW","Aruba","America/Aruba","-04:00"],
        ["AU","Australia","Antarctica/Macquarie","+11:00"],
        ["AU","Australia","Australia/Adelaide","+10:30"],
        ["AU","Australia","Australia/Brisbane","+10:00"],
        ["AU","Australia","Australia/Broken_Hill","+10:30"],
        ["AU","Australia","Australia/Currie","+11:00"],
        ["AU","Australia","Australia/Darwin","+09:30"],
        ["AU","Australia","Australia/Eucla","+08:45"],
        ["AU","Australia","Australia/Hobart","+11:00"],
        ["AU","Australia","Australia/Lindeman","+10:00"],
        ["AU","Australia","Australia/Lord_Howe","+11:00"],
        ["AU","Australia","Australia/Melbourne","+11:00"],
        ["AU","Australia","Australia/Perth","+08:00"],
        ["AU","Australia","Australia/Sydney","+11:00"],
        ["AT","Austria","Europe/Vienna","+01:00"],
        ["AZ","Azerbaijan","Asia/Baku","+04:00"],
        ["BS","Bahamas","America/Nassau","-05:00"],
        ["BH","Bahrain","Asia/Bahrain","+04:00"],
        ["BD","Bangladesh","Asia/Dhaka","+06:00"],
        ["BB","Barbados","America/Barbados","-04:00"],
        ["BY","Belarus","Europe/Minsk","+03:00"],
        ["BE","Belgium","Europe/Brussels","+01:00"],
        ["BZ","Belize","America/Belize","-06:00"],
        ["BJ","Benin","Africa/Porto-Novo","+01:00"],
        ["BM","Bermuda","Atlantic/Bermuda","-04:00"],
        ["BT","Bhutan","Asia/Thimphu","+06:00"],
        ["BO","Bolivia","America/La_Paz","-04:00"],
        ["BQ","Bonaire Saint Eustatius and Saba","America/Kralendijk","-04:00"],
        ["BA","Bosnia and Herzegovina","Europe/Sarajevo","+01:00"],
        ["BW","Botswana","Africa/Gaborone","+02:00"],
        ["BR","Brazil","America/Araguaina","-03:00"],
        ["BR","Brazil","America/Bahia","-03:00"],
        ["BR","Brazil","America/Belem","-03:00"],
        ["BR","Brazil","America/Boa_Vista","-04:00"],
        ["BR","Brazil","America/Campo_Grande","-03:00"],
        ["BR","Brazil","America/Cuiaba","-03:00"],
        ["BR","Brazil","America/Eirunepe","-05:00"],
        ["BR","Brazil","America/Fortaleza","-03:00"],
        ["BR","Brazil","America/Maceio","-03:00"],
        ["BR","Brazil","America/Manaus","-04:00"],
        ["BR","Brazil","America/Noronha","-02:00"],
        ["BR","Brazil","America/Porto_Velho","-04:00"],
        ["BR","Brazil","America/Recife","-03:00"],
        ["BR","Brazil","America/Rio_Branco","-05:00"],
        ["BR","Brazil","America/Santarem","-03:00"],
        ["BR","Brazil","America/Sao_Paulo","-02:00"],
        ["IO","British Indian Ocean Territory","Indian/Chagos","+06:00"],
        ["VG","British Virgin Islands","America/Tortola","-04:00"],
        ["BN","Brunei","Asia/Brunei","+08:00"],
        ["BG","Bulgaria","Europe/Sofia","+02:00"],
        ["BF","Burkina Faso","Africa/Ouagadougou","UTC"],
        ["BI","Burundi","Africa/Bujumbura","+02:00"],
        ["KH","Cambodia","Asia/Phnom_Penh","+07:00"],
        ["CM","Cameroon","Africa/Douala","+01:00"],
        ["CA","Canada","America/Atikokan","-05:00"],
        ["CA","Canada","America/Blanc-Sablon","-04:00"],
        ["CA","Canada","America/Cambridge_Bay","-07:00"],
        ["CA","Canada","America/Creston","-07:00"],
        ["CA","Canada","America/Dawson","-08:00"],
        ["CA","Canada","America/Dawson_Creek","-07:00"],
        ["CA","Canada","America/Edmonton","-07:00"],
        ["CA","Canada","America/Fort_Nelson","-07:00"],
        ["CA","Canada","America/Glace_Bay","-04:00"],
        ["CA","Canada","America/Goose_Bay","-04:00"],
        ["CA","Canada","America/Halifax","-04:00"],
        ["CA","Canada","America/Inuvik","-07:00"],
        ["CA","Canada","America/Iqaluit","-05:00"],
        ["CA","Canada","America/Moncton","-04:00"],
        ["CA","Canada","America/Nipigon","-05:00"],
        ["CA","Canada","America/Pangnirtung","-05:00"],
        ["CA","Canada","America/Rainy_River","-06:00"],
        ["CA","Canada","America/Rankin_Inlet","-06:00"],
        ["CA","Canada","America/Regina","-06:00"],
        ["CA","Canada","America/Resolute","-06:00"],
        ["CA","Canada","America/St_Johns","-03:30"],
        ["CA","Canada","America/Swift_Current","-06:00"],
        ["CA","Canada","America/Thunder_Bay","-05:00"],
        ["CA","Canada","America/Toronto","-05:00"],
        ["CA","Canada","America/Vancouver","-08:00"],
        ["CA","Canada","America/Whitehorse","-08:00"],
        ["CA","Canada","America/Winnipeg","-06:00"],
        ["CA","Canada","America/Yellowknife","-07:00"],
        ["CV","Cape Verde","Atlantic/Cape_Verde","-01:00"],
        ["KY","Cayman Islands","America/Cayman","-05:00"],
        ["CF","Central African Republic","Africa/Bangui","+01:00"],
        ["TD","Chad","Africa/Ndjamena","+01:00"],
        ["CL","Chile","America/Punta_Arenas","-03:00"],
        ["CL","Chile","America/Santiago","-03:00"],
        ["CL","Chile","Pacific/Easter","-05:00"],
        ["CN","China","Asia/Shanghai","+08:00"],
        ["CN","China","Asia/Urumqi","+06:00"],
        ["CX","Christmas Island","Indian/Christmas","+07:00"],
        ["CC","Cocos Islands","Indian/Cocos","+06:30"],
        ["CO","Colombia","America/Bogota","-05:00"],
        ["KM","Comoros","Indian/Comoro","+03:00"],
        ["CK","Cook Islands","Pacific/Rarotonga","-10:00"],
        ["CR","Costa Rica","America/Costa_Rica","-06:00"],
        ["HR","Croatia","Europe/Zagreb","+01:00"],
        ["CU","Cuba","America/Havana","-05:00"],
        ["CW","Curaçao","America/Curacao","-04:00"],
        ["CY","Cyprus","Asia/Famagusta","+03:00"],
        ["CY","Cyprus","Asia/Nicosia","+02:00"],
        ["CZ","Czech Republic","Europe/Prague","+01:00"],
        ["CD","Democratic Republic of the Congo","Africa/Kinshasa","+01:00"],
        ["CD","Democratic Republic of the Congo","Africa/Lubumbashi","+02:00"],
        ["DK","Denmark","Europe/Copenhagen","+01:00"],
        ["DJ","Djibouti","Africa/Djibouti","+03:00"],
        ["DM","Dominica","America/Dominica","-04:00"],
        ["DO","Dominican Republic","America/Santo_Domingo","-04:00"],
        ["TL","East Timor","Asia/Dili","+09:00"],
        ["EC","Ecuador","America/Guayaquil","-05:00"],
        ["EC","Ecuador","Pacific/Galapagos","-06:00"],
        ["EG","Egypt","Africa/Cairo","+02:00"],
        ["SV","El Salvador","America/El_Salvador","-06:00"],
        ["GQ","Equatorial Guinea","Africa/Malabo","+01:00"],
        ["ER","Eritrea","Africa/Asmara","+03:00"],
        ["EE","Estonia","Europe/Tallinn","+02:00"],
        ["ET","Ethiopia","Africa/Addis_Ababa","+03:00"],
        ["FK","Falkland Islands","Atlantic/Stanley","-03:00"],
        ["FO","Faroe Islands","Atlantic/Faroe","UTC"],
        ["FJ","Fiji","Pacific/Fiji","+13:00"],
        ["FI","Finland","Europe/Helsinki","+02:00"],
        ["FR","France","Europe/Paris","+01:00"],
        ["GF","French Guiana","America/Cayenne","-03:00"],
        ["PF","French Polynesia","Pacific/Gambier","-09:00"],
        ["PF","French Polynesia","Pacific/Marquesas","-09:30"],
        ["PF","French Polynesia","Pacific/Tahiti","-10:00"],
        ["TF","French Southern Territories","Indian/Kerguelen","+05:00"],
        ["GA","Gabon","Africa/Libreville","+01:00"],
        ["GM","Gambia","Africa/Banjul","UTC"],
        ["GE","Georgia","Asia/Tbilisi","+04:00"],
        ["DE","Germany","Europe/Berlin","+01:00"],
        ["DE","Germany","Europe/Busingen","+01:00"],
        ["GH","Ghana","Africa/Accra","UTC"],
        ["GI","Gibraltar","Europe/Gibraltar","+01:00"],
        ["GR","Greece","Europe/Athens","+02:00"],
        ["GL","Greenland","America/Danmarkshavn","UTC"],
        ["GL","Greenland","America/Godthab","-03:00"],
        ["GL","Greenland","America/Scoresbysund","-01:00"],
        ["GL","Greenland","America/Thule","-04:00"],
        ["GD","Grenada","America/Grenada","-04:00"],
        ["GP","Guadeloupe","America/Guadeloupe","-04:00"],
        ["GU","Guam","Pacific/Guam","+10:00"],
        ["GT","Guatemala","America/Guatemala","-06:00"],
        ["GG","Guernsey","Europe/Guernsey","UTC"],
        ["GN","Guinea","Africa/Conakry","UTC"],
        ["GW","Guinea-Bissau","Africa/Bissau","UTC"],
        ["GY","Guyana","America/Guyana","-04:00"],
        ["HT","Haiti","America/Port-au-Prince","-05:00"],
        ["HN","Honduras","America/Tegucigalpa","-06:00"],
        ["HK","Hong Kong","Asia/Hong_Kong","+08:00"],
        ["HU","Hungary","Europe/Budapest","+01:00"],
        ["IS","Iceland","Atlantic/Reykjavik","UTC"],
        ["IN","India","Asia/Kolkata","+05:30"],
        ["ID","Indonesia","Asia/Jakarta","+07:00"],
        ["ID","Indonesia","Asia/Jayapura","+09:00"],
        ["ID","Indonesia","Asia/Makassar","+08:00"],
        ["ID","Indonesia","Asia/Pontianak","+07:00"],
        ["IR","Iran","Asia/Tehran","+03:30"],
        ["IQ","Iraq","Asia/Baghdad","+03:00"],
        ["IE","Ireland","Europe/Dublin","UTC"],
        ["IM","Isle of Man","Europe/Isle_of_Man","UTC"],
        ["IL","Israel","Asia/Jerusalem","+02:00"],
        ["IT","Italy","Europe/Rome","+01:00"],
        ["CI","Ivory Coast","Africa/Abidjan","UTC"],
        ["JM","Jamaica","America/Jamaica","-05:00"],
        ["JP","Japan","Asia/Tokyo","+09:00"],
        ["JE","Jersey","Europe/Jersey","UTC"],
        ["JO","Jordan","Asia/Amman","+02:00"],
        ["KZ","Kazakhstan","Asia/Almaty","+06:00"],
        ["KZ","Kazakhstan","Asia/Aqtau","+05:00"],
        ["KZ","Kazakhstan","Asia/Aqtobe","+05:00"],
        ["KZ","Kazakhstan","Asia/Atyrau","+05:00"],
        ["KZ","Kazakhstan","Asia/Oral","+05:00"],
        ["KZ","Kazakhstan","Asia/Qyzylorda","+06:00"],
        ["KE","Kenya","Africa/Nairobi","+03:00"],
        ["KI","Kiribati","Pacific/Enderbury","+13:00"],
        ["KI","Kiribati","Pacific/Kiritimati","+14:00"],
        ["KI","Kiribati","Pacific/Tarawa","+12:00"],
        ["KW","Kuwait","Asia/Kuwait","+03:00"],
        ["KG","Kyrgyzstan","Asia/Bishkek","+06:00"],
        ["LA","Laos","Asia/Vientiane","+07:00"],
        ["LV","Latvia","Europe/Riga","+02:00"],
        ["LB","Lebanon","Asia/Beirut","+02:00"],
        ["LS","Lesotho","Africa/Maseru","+02:00"],
        ["LR","Liberia","Africa/Monrovia","UTC"],
        ["LY","Libya","Africa/Tripoli","+02:00"],
        ["LI","Liechtenstein","Europe/Vaduz","+01:00"],
        ["LT","Lithuania","Europe/Vilnius","+02:00"],
        ["LU","Luxembourg","Europe/Luxembourg","+01:00"],
        ["MO","Macao","Asia/Macau","+08:00"],
        ["MK","Macedonia","Europe/Skopje","+01:00"],
        ["MG","Madagascar","Indian/Antananarivo","+03:00"],
        ["MW","Malawi","Africa/Blantyre","+02:00"],
        ["MY","Malaysia","Asia/Kuala_Lumpur","+08:00"],
        ["MY","Malaysia","Asia/Kuching","+08:00"],
        ["MV","Maldives","Indian/Maldives","+05:00"],
        ["ML","Mali","Africa/Bamako","UTC"],
        ["MT","Malta","Europe/Malta","+01:00"],
        ["MH","Marshall Islands","Pacific/Kwajalein","+12:00"],
        ["MH","Marshall Islands","Pacific/Majuro","+12:00"],
        ["MQ","Martinique","America/Martinique","-04:00"],
        ["MR","Mauritania","Africa/Nouakchott","UTC"],
        ["MU","Mauritius","Indian/Mauritius","+04:00"],
        ["YT","Mayotte","Indian/Mayotte","+03:00"],
        ["MX","Mexico","America/Bahia_Banderas","-06:00"],
        ["MX","Mexico","America/Cancun","-05:00"],
        ["MX","Mexico","America/Chihuahua","-07:00"],
        ["MX","Mexico","America/Hermosillo","-07:00"],
        ["MX","Mexico","America/Matamoros","-06:00"],
        ["MX","Mexico","America/Mazatlan","-07:00"],
        ["MX","Mexico","America/Merida","-06:00"],
        ["MX","Mexico","America/Mexico_City","-06:00"],
        ["MX","Mexico","America/Monterrey","-06:00"],
        ["MX","Mexico","America/Ojinaga","-07:00"],
        ["MX","Mexico","America/Tijuana","-08:00"],
        ["FM","Micronesia","Pacific/Chuuk","+10:00"],
        ["FM","Micronesia","Pacific/Kosrae","+11:00"],
        ["FM","Micronesia","Pacific/Pohnpei","+11:00"],
        ["MD","Moldova","Europe/Chisinau","+02:00"],
        ["MC","Monaco","Europe/Monaco","+01:00"],
        ["MN","Mongolia","Asia/Choibalsan","+08:00"],
        ["MN","Mongolia","Asia/Hovd","+07:00"],
        ["MN","Mongolia","Asia/Ulaanbaatar","+08:00"],
        ["ME","Montenegro","Europe/Podgorica","+01:00"],
        ["MS","Montserrat","America/Montserrat","-04:00"],
        ["MA","Morocco","Africa/Casablanca","UTC"],
        ["MZ","Mozambique","Africa/Maputo","+02:00"],
        ["MM","Myanmar","Asia/Yangon","+06:30"],
        ["NA","Namibia","Africa/Windhoek","+02:00"],
        ["NR","Nauru","Pacific/Nauru","+12:00"],
        ["NP","Nepal","Asia/Kathmandu","+05:45"],
        ["NL","Netherlands","Europe/Amsterdam","+01:00"],
        ["NC","New Caledonia","Pacific/Noumea","+11:00"],
        ["NZ","New Zealand","Pacific/Auckland","+13:00"],
        ["NZ","New Zealand","Pacific/Chatham","+13:45"],
        ["NI","Nicaragua","America/Managua","-06:00"],
        ["NE","Niger","Africa/Niamey","+01:00"],
        ["NG","Nigeria","Africa/Lagos","+01:00"],
        ["NU","Niue","Pacific/Niue","-11:00"],
        ["NF","Norfolk Island","Pacific/Norfolk","+11:00"],
        ["KP","North Korea","Asia/Pyongyang","+08:30"],
        ["MP","Northern Mariana Islands","Pacific/Saipan","+10:00"],
        ["NO","Norway","Europe/Oslo","+01:00"],
        ["OM","Oman","Asia/Muscat","+04:00"],
        ["PK","Pakistan","Asia/Karachi","+05:00"],
        ["PW","Palau","Pacific/Palau","+09:00"],
        ["PS","Palestinian Territory","Asia/Gaza","+02:00"],
        ["PS","Palestinian Territory","Asia/Hebron","+02:00"],
        ["PA","Panama","America/Panama","-05:00"],
        ["PG","Papua New Guinea","Pacific/Bougainville","+11:00"],
        ["PG","Papua New Guinea","Pacific/Port_Moresby","+10:00"],
        ["PY","Paraguay","America/Asuncion","-03:00"],
        ["PE","Peru","America/Lima","-05:00"],
        ["PH","Philippines","Asia/Manila","+08:00"],
        ["PN","Pitcairn","Pacific/Pitcairn","-08:00"],
        ["PL","Poland","Europe/Warsaw","+01:00"],
        ["PT","Portugal","Atlantic/Azores","-01:00"],
        ["PT","Portugal","Atlantic/Madeira","UTC"],
        ["PT","Portugal","Europe/Lisbon","UTC"],
        ["PR","Puerto Rico","America/Puerto_Rico","-04:00"],
        ["QA","Qatar","Asia/Qatar","+04:00"],
        ["CG","Republic of the Congo","Africa/Brazzaville","+01:00"],
        ["RE","Reunion","Indian/Reunion","+04:00"],
        ["RO","Romania","Europe/Bucharest","+02:00"],
        ["RU","Russia","Asia/Anadyr","+12:00"],
        ["RU","Russia","Asia/Barnaul","+07:00"],
        ["RU","Russia","Asia/Chita","+09:00"],
        ["RU","Russia","Asia/Irkutsk","+08:00"],
        ["RU","Russia","Asia/Kamchatka","+12:00"],
        ["RU","Russia","Asia/Khandyga","+09:00"],
        ["RU","Russia","Asia/Krasnoyarsk","+07:00"],
        ["RU","Russia","Asia/Magadan","+11:00"],
        ["RU","Russia","Asia/Novokuznetsk","+07:00"],
        ["RU","Russia","Asia/Novosibirsk","+07:00"],
        ["RU","Russia","Asia/Omsk","+06:00"],
        ["RU","Russia","Asia/Sakhalin","+11:00"],
        ["RU","Russia","Asia/Srednekolymsk","+11:00"],
        ["RU","Russia","Asia/Tomsk","+07:00"],
        ["RU","Russia","Asia/Ust-Nera","+10:00"],
        ["RU","Russia","Asia/Vladivostok","+10:00"],
        ["RU","Russia","Asia/Yakutsk","+09:00"],
        ["RU","Russia","Asia/Yekaterinburg","+05:00"],
        ["RU","Russia","Europe/Astrakhan","+04:00"],
        ["RU","Russia","Europe/Kaliningrad","+02:00"],
        ["RU","Russia","Europe/Kirov","+03:00"],
        ["RU","Russia","Europe/Moscow","+03:00"],
        ["RU","Russia","Europe/Samara","+04:00"],
        ["RU","Russia","Europe/Saratov","+04:00"],
        ["RU","Russia","Europe/Simferopol","+03:00"],
        ["RU","Russia","Europe/Ulyanovsk","+04:00"],
        ["RU","Russia","Europe/Volgograd","+03:00"],
        ["RW","Rwanda","Africa/Kigali","+02:00"],
        ["BL","Saint Barthélemy","America/St_Barthelemy","-04:00"],
        ["SH","Saint Helena","Atlantic/St_Helena","UTC"],
        ["KN","Saint Kitts and Nevis","America/St_Kitts","-04:00"],
        ["LC","Saint Lucia","America/St_Lucia","-04:00"],
        ["MF","Saint Martin","America/Marigot","-04:00"],
        ["PM","Saint Pierre and Miquelon","America/Miquelon","-03:00"],
        ["VC","Saint Vincent and the Grenadines","America/St_Vincent","-04:00"],
        ["WS","Samoa","Pacific/Apia","+14:00"],
        ["SM","San Marino","Europe/San_Marino","+01:00"],
        ["ST","Sao Tome and Principe","Africa/Sao_Tome","UTC"],
        ["SA","Saudi Arabia","Asia/Riyadh","+03:00"],
        ["SN","Senegal","Africa/Dakar","UTC"],
        ["RS","Serbia","Europe/Belgrade","+01:00"],
        ["SC","Seychelles","Indian/Mahe","+04:00"],
        ["SL","Sierra Leone","Africa/Freetown","UTC"],
        ["SG","Singapore","Asia/Singapore","+08:00"],
        ["SX","Sint Maarten","America/Lower_Princes","-04:00"],
        ["SK","Slovakia","Europe/Bratislava","+01:00"],
        ["SI","Slovenia","Europe/Ljubljana","+01:00"],
        ["SB","Solomon Islands","Pacific/Guadalcanal","+11:00"],
        ["SO","Somalia","Africa/Mogadishu","+03:00"],
        ["ZA","South Africa","Africa/Johannesburg","+02:00"],
        ["GS","South Georgia and the South Sandwich Islands","Atlantic/South_Georgia","-02:00"],
        ["KR","South Korea","Asia/Seoul","+09:00"],
        ["SS","South Sudan","Africa/Juba","+03:00"],
        ["ES","Spain","Africa/Ceuta","+01:00"],
        ["ES","Spain","Atlantic/Canary","UTC"],
        ["ES","Spain","Europe/Madrid","+01:00"],
        ["LK","Sri Lanka","Asia/Colombo","+05:30"],
        ["SD","Sudan","Africa/Khartoum","+03:00"],
        ["SR","Suriname","America/Paramaribo","-03:00"],
        ["SJ","Svalbard and Jan Mayen","Arctic/Longyearbyen","+01:00"],
        ["SZ","Swaziland","Africa/Mbabane","+02:00"],
        ["SE","Sweden","Europe/Stockholm","+01:00"],
        ["CH","Switzerland","Europe/Zurich","+01:00"],
        ["SY","Syria","Asia/Damascus","+02:00"],
        ["TW","Taiwan","Asia/Taipei","+08:00"],
        ["TJ","Tajikistan","Asia/Dushanbe","+05:00"],
        ["TZ","Tanzania","Africa/Dar_es_Salaam","+03:00"],
        ["TH","Thailand","Asia/Bangkok","+07:00"],
        ["TG","Togo","Africa/Lome","UTC"],
        ["TK","Tokelau","Pacific/Fakaofo","+13:00"],
        ["TO","Tonga","Pacific/Tongatapu","+14:00"],
        ["TT","Trinidad and Tobago","America/Port_of_Spain","-04:00"],
        ["TN","Tunisia","Africa/Tunis","+01:00"],
        ["TR","Turkey","Europe/Istanbul","+03:00"],
        ["TM","Turkmenistan","Asia/Ashgabat","+05:00"],
        ["TC","Turks and Caicos Islands","America/Grand_Turk","-04:00"],
        ["TV","Tuvalu","Pacific/Funafuti","+12:00"],
        ["VI","U.S. Virgin Islands","America/St_Thomas","-04:00"],
        ["UG","Uganda","Africa/Kampala","+03:00"],
        ["UA","Ukraine","Europe/Kiev","+02:00"],
        ["UA","Ukraine","Europe/Uzhgorod","+02:00"],
        ["UA","Ukraine","Europe/Zaporozhye","+02:00"],
        ["AE","United Arab Emirates","Asia/Dubai","+04:00"],
        ["GB","United Kingdom","Europe/London","UTC"],
        ["US","United States","America/Adak","-10:00"],
        ["US","United States","America/Anchorage","-09:00"],
        ["US","United States","America/Boise","-07:00"],
        ["US","United States","America/Chicago","-06:00"],
        ["US","United States","America/Denver","-07:00"],
        ["US","United States","America/Detroit","-05:00"],
        ["US","United States","America/Indiana/Indianapolis","-05:00"],
        ["US","United States","America/Indiana/Knox","-06:00"],
        ["US","United States","America/Indiana/Marengo","-05:00"],
        ["US","United States","America/Indiana/Petersburg","-05:00"],
        ["US","United States","America/Indiana/Tell_City","-06:00"],
        ["US","United States","America/Indiana/Vevay","-05:00"],
        ["US","United States","America/Indiana/Vincennes","-05:00"],
        ["US","United States","America/Indiana/Winamac","-05:00"],
        ["US","United States","America/Juneau","-09:00"],
        ["US","United States","America/Kentucky/Louisville","-05:00"],
        ["US","United States","America/Kentucky/Monticello","-05:00"],
        ["US","United States","America/Los_Angeles","-08:00"],
        ["US","United States","America/Menominee","-06:00"],
        ["US","United States","America/Metlakatla","-09:00"],
        ["US","United States","America/New_York","-05:00"],
        ["US","United States","America/Nome","-09:00"],
        ["US","United States","America/North_Dakota/Beulah","-06:00"],
        ["US","United States","America/North_Dakota/Center","-06:00"],
        ["US","United States","America/North_Dakota/New_Salem","-06:00"],
        ["US","United States","America/Phoenix","-07:00"],
        ["US","United States","America/Sitka","-09:00"],
        ["US","United States","America/Yakutat","-09:00"],
        ["US","United States","Pacific/Honolulu","-10:00"],
        ["UM","United States Minor Outlying Islands","Pacific/Midway","-11:00"],
        ["UM","United States Minor Outlying Islands","Pacific/Wake","+12:00"],
        ["UY","Uruguay","America/Montevideo","-03:00"],
        ["UZ","Uzbekistan","Asia/Samarkand","+05:00"],
        ["UZ","Uzbekistan","Asia/Tashkent","+05:00"],
        ["VU","Vanuatu","Pacific/Efate","+11:00"],
        ["VA","Vatican","Europe/Vatican","+01:00"],
        ["VE","Venezuela","America/Caracas","-04:00"],
        ["VN","Vietnam","Asia/Ho_Chi_Minh","+07:00"],
        ["WF","Wallis and Futuna","Pacific/Wallis","+12:00"],
        ["EH","Western Sahara","Africa/El_Aaiun","UTC"],
        ["YE","Yemen","Asia/Aden","+03:00"],
        ["ZM","Zambia","Africa/Lusaka","+02:00"],
        ["ZW","Zimbabwe","Africa/Harare","+02:00"]];

    $scope.dated = dateAndTimeFormat;

    $scope.getTeam = function(){
            $http({
                method: "GET",
                url: "/admin/league_team/?leagueId="+$scope.match.series_id,
            }).success(function (result) {
                if (result.status == true) {
                    $scope.teams=result.data;
                }
            })
    }

    $scope.getData = function(){

            $http({
                method: "GET",
                url: "/admin/leagues",
            }).success(function (result) {
                if (result.status == true) {
                    $scope.leagues=result.data;

                } else {
                    window.location.href = '/';
                }
            })
            $http({
                method: "GET",
                url: "/admin/sports",
            }).success(function (result) {
                if (result.status == true) {
                    $scope.sports=result.data;


            $http({
                method: "GET",
                url: "/admin/matches/"+$stateParams.id,
            }).success(function (result) {
                if (result.status == true) {
                 setTimeout(()=>{
                    $scope.match = result.data;
                     $scope.getTeam();
                    $scope.match.start_date = new Date($scope.match.start_date)
                    $scope.match.start_time= ($scope.match.start_time).toString();
                    $scope.match.end_date = new Date($scope.match.end_date)
                    $scope.match.sport_id= ($scope.match.sport_id).toString()
                    $scope.match.series_id= ($scope.match.series_id).toString()
                    $scope.match.stronger_team_id= ($scope.match.stronger_team_id).toString()
                    $scope.match.team_a_id= ($scope.match.team_a_id).toString()
                    $scope.match.team_b_id= ($scope.match.team_b_id).toString()
                 },500)
                }
            })

                } else {
                    window.location.href = '/';
                }
            })



            $http({
                method: "GET",
                url: "/admin/teams?sport_id=1",
            }).success(function (result) {
                if (result.status == true) {
                    $scope.teams=result.data;
                } else {
                    window.location.href = '/';
                }
            })
        }

    $scope.getData();

    $scope.save=function(){

        var fd = new FormData();
        var startDate = new Date($scope.match.start_date);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        $scope.match.start_date = new Date(startDate ).getTime() + (parseInt($scope.match.start_time)*60*1000);
        $scope.match.end_date = new Date($scope.match.end_date).getTime();
        for(var k in $scope.match){
            fd.append(k, $scope.match[k]);
        }

        $http.put('/admin/matches/'+$stateParams.id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('matches');
                window.toastr.success(result.message)
            })
            .error(function(result){
                window.toastr.warning(result.message)
            });
    }

});
app.controller("matches",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.dated = dateFormat;

    $scope.getData = function(){

        $http({
            method: "GET",
            url: "/admin/matches",
        }).success(function (result) {
            if (result.status == true) {
                $scope.data=result.data;
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

            $http.delete('/admin/matches/'+$scope.removingId,fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){

                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#confirmation").modal("hide")
                    $location.path('matches');
                }
                else {
                    $("#confirmation").modal("hide")

                }
            })
        }

    }

    $scope.match = {};
    $scope.scoreUpdate = function(match){
        if(match.id) {
            $scope.match = JSON.parse(JSON.stringify(match))
            $scope.match.team_win_id = $scope.match.team_win_id.toString();
            $scope.match.team_a_id = $scope.match.team_a_id.toString();
            $scope.match.team_b_id = $scope.match.team_b_id.toString();
            $("#update").modal("show")
            setTimeout(function(){
                $("#team_win_id").val($scope.match.team_win_id)
            },500)
        }
    }
    $scope.changeStatus = function() {
        if($scope.match.match_status !== 'started'){
            $scope.match.isLive = false;
        }
    };

    $scope.update = function(){
       $http({
            url: '/admin/matches_scoreUpdate/'+$scope.match.id,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            data: $scope.match
        }).success(function (data) {
            if (data.status) {
                window.toastr.success(data.message);
                $location.path('matches');
                $("#update").modal("hide")
            }
            else {
                window.toastr.warning(data.message)

            }
        })


    }

});
app.controller("configs",function($scope,$http,$location,$localStorage,$stateParams){


        $scope.dated = dateAndTimeFormat;
        $scope.getData = function(){

            $http({
                method: "GET",
                url: "/admin/configurations",
            }).success(function (result) {
                if (result.status == true) {
                    var data=result.data;
                    $scope.data = [];
                    for(var k in data){
                      $scope.data.push({
                          param:k,
                          value:data[k]
                      })
                        }

                } else {
                    window.location.href = '/';
                }
            })
        }

    $scope.getData();
    $scope.save=function(){
        var fd = new FormData();
        var data = {};
        for(var i = 0;i<$scope.data.length;i++){
            data[$scope.data[i]['param']]=$scope.data[i]['value'];
        }
        for(var k in data){
            if(!data[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, data[k]);
        }

        $http.post('/admin/configurations', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('configs')
                window.toastr.success(result.message)
            })
            .error(function(result){
                window.toastr.warning(result.message)
            });



    }


});
app.controller("sendNotification",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.getData = function(){

        $http({
            method: "GET",
            url: "/admin/leagues",
        }).success(function (result) {
            if (result.status == true) {
                $scope.leagues=result.data;

            } else {
                window.location.href = '/';
            }
        })
    }
    $scope.getData();
    $scope.sendVersionNameNotification=function(){
        var fd = new FormData();
        $scope.data = {};

        $scope.data.versionName  = $scope.versionName;
        console.log($scope.data)

        if(!$scope.data.versionName){
            window.toastr.warning("Please proovide Version Name")
            return false;
        }

        for(var k in $scope.data){
            fd.append(k, $scope.data[k]);
        }

        $http.post('/admin/sendNotificationForNewVersion', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('notification')
                window.toastr.success(result.message)
            })
            .error(function(result){
                window.toastr.warning(result.message)
            });
    }
    $scope.sendPromoTitleNotification=function(){
        var fd = new FormData();
        $scope.data = {};

        $scope.data.promoTitle  = $scope.promoTitle;
        console.log($scope.data)

        if(!$scope.data.promoTitle){
            window.toastr.warning("Please provide Promo Title")
            return false;
        }

        for(var k in $scope.data){
            fd.append(k, $scope.data[k]);
        }

        $http.post('/admin/sendNotificationForPromoAnnouncement', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('notification')
                window.toastr.success(result.message)
            })
            .error(function(result){
                window.toastr.warning(result.message)
            });
    }
    $scope.sendNotificationToTopTenUsers=function(){
        var fd = new FormData();
        $scope.data = {};

        $scope.data.series_id  = $scope.series_id;
        console.log($scope.data);

        if(!$scope.data.series_id){
            window.toastr.warning("Please Select League")
            return false;
        }

        for(var k in $scope.data){
            fd.append(k, $scope.data[k]);
        }

        $http.post('/admin/sendNotificationToTopTenUsers', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('notification')
                window.toastr.success(result.message)
            })
            .error(function(result){
                window.toastr.warning(result.message)
            });
    }
    $scope.sendNotificationToTopThreeUsers=function(){
        var fd = new FormData();
        $scope.data = {};

        $scope.data.seriesId  = $scope.seriesId;
        console.log($scope.data);

        if(!$scope.data.seriesId){
            window.toastr.warning("Please Select League")
            return false;
        }

        for(var k in $scope.data){
            fd.append(k, $scope.data[k]);
        }

        $http.post('/admin/sendNotificationToTopThreeUsers', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('notification')
                window.toastr.success(result.message)
            })
            .error(function(result){
                window.toastr.warning(result.message)
            });
    }
    $scope.sendAppGuidanceNotification=function(){

        $http({
            method: "GET",
            url: "/admin/sendNotificationForAppGuidance",
        })
            .success(function(result){
            $location.path('notification')
            window.toastr.success(result.message)
        })
            .error(function(result){
                window.toastr.warning(result.message)
            });
    }


});
app.controller("add-team",function($scope,$http,$location,$localStorage,$stateParams){


    $scope.dated = dateAndTimeFormat;
    $scope.getData = function(){

        $http({
            method: "GET",
            url: "/admin/league_team/?leagueId="+$stateParams.id,
        }).success(function (result) {
            if (result.status == true) {
                $scope.teams_selected=result.data;
                $http({
                    method: "GET",
                    url: "/admin/leagues/"+$stateParams.id,
                }).success(function (result) {
                    if (result.status == true) {
                        $scope.league=result.data;

                        $http({
                            method: "GET",
                            url: "/admin/teams?sport_id="+$scope.league.sport_id,
                        }).success(function (result) {
                            if (result.status == true) {
                                $scope.teams=result.data;
                                for(var i = 0;i<$scope.teams.length;i++){
                                    $scope.teams[i].selected = false;
                                    for(var j = 0;j<$scope.teams_selected.length;j++) {
                                        if($scope.teams[i].id==$scope.teams_selected[j].id){
                                            $scope.teams[i].selected = true;
                                        }
                                    }
                                }
                            } else {
                                window.location.href = '/';
                            }
                        })



                    } else {
                        window.location.href = '/';
                    }
                })
            } else {
                window.location.href = '/';
            }
        })
    }

    $scope.getData();


    $scope.save=function(){

        var savingObj = {
            teams:[],
            leagueId:$stateParams.id
        }

        for(var i = 0;i<$scope.teams.length;i++){
            if($scope.teams[i].selected){
                savingObj.teams.push($scope.teams[i].id)
            }
        }

        $http({
            url: '/admin/league_teams',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            data: savingObj
        }).success(function (data) {
            if (data.status) {
                window.toastr.success(data.message)

            }
            else {
                window.toastr.warning(data.message)

            }
        })


    }

});
app.controller("edit-sponsors",function($scope,$http,$location,$localStorage,$stateParams){


    $scope.heading = 'Edit Sponsor'
    $scope.sponsor = {
        name:'',
        status:'',
        series_id:''
    }

    $scope.getData = function(){

        $http({
            method: "GET",
            url: "/admin/leagues",
        }).success(function (result) {
            if (result.status == true) {
                $scope.leagues=result.data;

            } else {
                window.location.href = '/';
            }
        })

        $http({
            method: "GET",
            url: "/admin/sponsors/"+$stateParams.id,
        }).success(function (result) {
            if (result.status == true) {
                $scope.sponsor = result.data;
                $scope.sponsor.status=$scope.sponsor.status.toString();
                $scope.sponsor.series_id = $scope.sponsor.series_id.toString();
            } else {
                window.location.href = '/';
            }
        })

    }

    $scope.getData();


    $scope.save=function(){
        var fd = new FormData();
        console.log("save sponsor ")
        console.log($scope.sponsor)
        for(var k in $scope.sponsor){
            if(!$scope.sponsor[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, $scope.sponsor[k]);
        }

        $http.put('/admin/sponsors/'+$stateParams.id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('sponsors')
                window.toastr.success(result.message)
            })
            .error(function(result){
                window.toastr.warning(result.message)
            });



    }

});
app.controller("add-sponsors",function($scope,$http,$location,$localStorage){

    $scope.heading = 'Add new Sponsor'
    $scope.dated = dateAndTimeFormat;
    $scope.getData = function(){

        $http({
            method: "GET",
            url: "/admin/leagues",
        }).success(function (result) {
            if (result.status == true) {
                $scope.leagues=result.data;

            } else {
                window.location.href = '/';
            }
        })
    }

    $scope.getData();

    $scope.sponsor = {
        name:'',
        status:'',
        series_id:'',
    }

    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.sponsor){
            if(!$scope.sponsor[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, $scope.sponsor[k]);
        }

        $http.post('/admin/sponsors', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('sponsors')
                window.toastr.success(result.message)
            })
            .error(function(result){
                window.toastr.warning(result.message)
            });



    }

});
app.controller("sponsors",function($scope,$http,$location,$localStorage){

    $scope.dated = dateAndTimeFormat;
    $scope.getData = function(){
        $http({
            method: "GET",
            url: "/admin/sponsors",
        }).success(function (result) {
            console.log(result)
            if (result.status == true) {
                $scope.data=result.data;

            } else {
                window.location.href = '/';
            }
        });
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



            $http.delete('/admin/sponsor/'+$scope.removingId, fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){

                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#confirmation").modal("hide")
                    window.toastr.success(data.message)
                }
                else {
                    $("#confirmation").modal("hide")

                }
            })
        }

    }


});
app.controller("edit-banners",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.heading = 'Edit Banner';
    $scope.banner = {
        sponsor_id:'',
        status:'',
        banner_strip_img:'',
        banner_strip_link:'',
        banner_full_box_img:'',
        banner_full_box_link:''
    }

    $scope.getData = function(){

        $http({
            method: "GET",
            url: "/admin/sponsors",
        }).success(function (result) {
            if (result.status == true) {
                $scope.sponsors=result.data;

            } else {
                window.location.href = '/';
            }
        })

        $http({
            method: "GET",
            url: "/admin/banner/"+$stateParams.id,
        }).success(function (result) {
            if (result.status == true) {
                $scope.banners = result.data;
                $scope.banners.status = $scope.banners.status.toString();
                $scope.banners.sponsor_id = $scope.banners.sponsor_id.toString();
            } else {
                window.location.href = '/';
            }
        })

    }

    $scope.getData();


    $scope.save=function(){
        var fd = new FormData();
        console.log("save banner ")
        console.log($scope.banners)
        for(var k in $scope.banners){
            // if(!$scope.banners.sponsor_id || !$scope.banners.status) {
            //     window.toastr.warning("Please provide " + k.toUpperCase().replace('_', ' '))
            //     return false;
            // }
            fd.append(k, $scope.banners[k]);
        }
        $http.put('/admin/banner/'+$stateParams.id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('banners')
                window.toastr.success(result.message)
            })
            .error(function(result){
                window.toastr.warning(result.message)
            });



    }

});
app.controller("add-banners",function($scope,$http,$location,$localStorage){

    $scope.heading = 'Add new Banner';
    $scope.dated = dateAndTimeFormat;
    $scope.getData = function(){

        $http({
            method: "GET",
            url: "/admin/sponsors",
        }).success(function (result) {
            if (result.status == true) {
                $scope.sponsors=result.data;

            } else {
                window.location.href = '/';
            }
        })
    }

    $scope.getData();

    $scope.banners = {
        sponsor_id:'',
        status:'',
        banner_strip_img:'',
        banner_strip_link:'',
        banner_full_box_img:'',
        banner_full_box_link:''
    }

    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.banners){
            // console.log($scope.banners[k])
            // console.log(k)
            // if(k){
            //     if( || !$scope.banners.status) {
            //         window.toastr.warning("Please provide " + k.toUpperCase().replace('_', ' '))
            //         return false;
            //     }
                fd.append(k, $scope.banners[k]);
            // }

        }

        $http.post('/admin/banners', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('banners');
                window.toastr.success(result.message)
            })
            .error(function(result){
                window.toastr.warning(result.message)
            });



    }

});
app.controller("banners",function($scope,$http,$location,$localStorage){

    $scope.dated = dateAndTimeFormat;
    $scope.getData = function(){
        $http({
            method: "GET",
            url: "/admin/banners",
        }).success(function (result) {
            console.log(result)
            if (result.status == true) {
                $scope.data=result.data;

            } else {
                window.location.href = '/';
            }
        });
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



            $http.delete('/admin/banner/'+$scope.removingId, fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){

                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#confirmation").modal("hide")
                    $location.path('banners');
                    window.toastr.success(data.message)

                }
                else {
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
