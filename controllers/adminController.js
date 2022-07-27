
const UserModel = require("../models/User");
const HotelModel = require("../models/Hotels");
const TypeModel = require("../models/Type");
const bcrypt = require("bcryptjs");

const adminController = {

    index: async (request, response) => {
        if (request.session.user) {
            let user = request.session.user;
            if(user.type == '6189f042f8bae7b5d035a19f'){
                response.render('admin/index', {user: user})
            }
            else{
                response.render('admin/user_index', {user: user})
            }
        } else {
            response.redirect('/admin/login')
        }
    },
    login: async (request, response) => {
        console.log(" ======================================= Admin login page ======================================= ")
        console.log(" ======================================= " + new Date() + " ======================================= ")
        response.render("admin/login", {status: true, message: ""})
    },
    loginPost: async (req, res) => {
        console.log(" ================== Admin Login Request  ===================")
        console.log(" ======================================= " + new Date() + " ======================================= ")
        console.log("BODY = " + JSON.stringify(req.body));
        const body = JSON.parse(JSON.stringify(req.body));

        try {
            if (body.email && body.password) {
                let user = await UserModel.findOne({email: body.email});
                if (user) {
                    const isMatch = await bcrypt.compare(body.password, user.password);
                    if (isMatch) {
                        req.session.user = user;
                        res.redirect("/admin")
                    } else {
                        res.render("admin/login", {status: false, message: "Invalid Password"});
                    }
                } else {
                    res.render("admin/login", {status: false, message: "Email address not exist"});
                }
            }
        } catch (err) {
            console.log(err);
            res
                .status(500)
                .json({errors: {msg: err}});
        }
    },
    changePassword: async (req, res) => {
        console.log("====== Get Change Password Page API =======");
         if(req.params.id  == '451F4B2863FE5D3E1F3A6D497EC240B621B2E41E8F2B8193'){
             res.render('changePassword',{status:true,message:""});
         }
         else{
             res.redirect('/admin/login');
         }
    },
    updatePassword: async (req,res) =>{

        console.log("================== Update Password ====================")
        console.log("================== "+new Date()+" ====================")
        console.log("BODY ="+JSON.stringify(req.body))
        const body = JSON.parse(JSON.stringify(req.body));

         try {
             if(body.password && body.currentPassword && body.confirmPassword) {

                 let user = await UserModel.findOne({type:'6189f042f8bae7b5d035a19f'});
                 if (user) {
                     const isMatch = await bcrypt.compare(body.currentPassword, user.password);
                     if (isMatch) {
                          // update Password
                          if(body.password == body.confirmPassword) {

                              const salt = await bcrypt.genSalt(10);
                              const updatedPassword = await bcrypt.hash(body.password, salt);

                              let updatedObj =  await UserModel.findOneAndUpdate({_id: user._id},
                                  {   $set:  {password:updatedPassword} },  {new: true});

                              console.log("New updatedObj");
                              console.log(updatedObj);
                              console.log("Password updated successfully");
                              res.render("changePassword",{'status':true,resCode:200,message:"Password updated successfully"});
                          }
                          else{
                              console.log("New Password and Confirm Password does not match");
                              res.render("changePassword",{status:false,resCode:400,'message':'New Password and Confirm Password does not match'});
                          }
                     } else {
                         console.log("Incorrect Current password");
                         res.render("changePassword",{status:false,resCode:400,'message':'Incorrect Current password'});
                     }
                 } else {
                     res.render("changePassword",{status:false,resCode:400,'message':'Wrong User'});
                 }
             }
             else{
                 res.render("changePassword",{status:false,resCode:400,'message':'Incomplete information'});
             }
        }catch (err) {
            console.log(err);
             res.render("changePassword",{status:false,resCode:400,'message':err});
        }
        },
    getUserType: async (request, response) => {

        console.log("====== Type Get All API =======");

        try {
            // get all types
            let types = await TypeModel.find();
            response
                .status(200)
                .json({
                    status: true,
                    types,
                    msg: "Types found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },
    getAllUsers: async (request, response) => {

        console.log("====== Users Get All API =======");

        try {
            // get all users
            let users = await UserModel.find({type:{$ne:'6189f042f8bae7b5d035a19f'}}).populate('hotelId').exec();;
            console.log(users);
            response
                .status(200)
                .json({
                    status: true,
                    users,
                    msg: "Users found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },
    addUser: async (request, response) => {

        console.log("====== Users Add API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));

        try {
            // check if there is any record with same email
            const userByEmail = await UserModel.findOne({email: body.email});
            if (userByEmail) {
                return response
                    .status(422)
                    .json({msg: "User with this Email already exists"});
            }

            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(body.password, salt);

            let userObj;
            userObj = {
                name: body.name,
                password: password,
                email: body.email,
                hotelId: body.hotelId,
                type: '6189abdd8610f852e52ed7a3'
            };
            let user = new UserModel(userObj);
            user.save();
            response
                .status(200)
                .json({
                    msg: "User is successfully created."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }

    },
    updateUser: async (request, response) => {

        console.log("====== Users Update API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));
        const id = request.params.id;
        try {
            // check if there is any record with same email
            const userByEmail = await UserModel.findOne({ _id: { $ne: id }, email: body.email });
            if (userByEmail) {
                return response
                    .status(422)
                    .json({msg: "User with this Email already exists"});
            }

            // const salt = await bcrypt.genSalt(10);
            // const password = await bcrypt.hash(body.password, salt);

            let userObj;
            userObj = {
                name: body.name,
                email: body.email,
                hotelId: body.hotelId,
            };

            let updatedObj =  await UserModel.findOneAndUpdate({_id: id},
                {   $set:  userObj },  {new: true});

            console.log("New updatedObj");
            console.log(updatedObj);

            response
                .status(200)
                .json({
                    msg: "User is successfully updated."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }

    },
    deleteUser: async (request, response) =>{

        console.log("====== User Delete API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));
        try {

            let user = await UserModel.deleteOne({_id:body.id});
            response
                .status(200)
                .json({
                    status:true,
                    msg: "User deleted successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },
    getUserDetail: async (request, response) =>{

        console.log("====== User Get API =======");
        console.log("Params");
        console.log(request.params.id);

        try {
            // get all hotels
            let user = await UserModel.findOne({_id:request.params.id});
            response
                .status(200)
                .json({
                    status:true,
                    user,
                    msg: "User found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },
    logout: async (request, response) => {
        console.log("================== LOGOUT API ====================")
        console.log("================== "+new Date()+" ====================")
        var user = request.session.user;

        delete request.session.user;

        response.redirect('/admin')

    }
}

module.exports = adminController;


