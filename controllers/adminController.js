
const UserModel = require("../models/User");

const adminController = {

    index: async (request, response) => {
        if(request.session.user){
            let user = request.session.user;
            response.render('admin/index',{user:user})
        }else{
            response.redirect('/admin/login')
        }
    },
    login: async (request, response) => {
        console.log(" ======================================= Admin login page ======================================= ")
        console.log(" ======================================= "+new Date()+" ======================================= ")
        response.render("admin/login",{status:true,message:""})
    },
    loginPost: async (req , res) => {
        console.log(" ================== Admin Login Request  ===================")
        console.log(" ======================================= "+new Date()+" ======================================= ")
        console.log("BODY = "+JSON.stringify(req.body));
        const body = JSON.parse(JSON.stringify(req.body));

        try{
            if(body.email && body.password) {
                let user = await UserModel.findOne({email:body.email});
                if(user){
                    if(body.password == user.password){
                        req.session.user = user;
                        res.redirect("/admin")
                    }
                    else{
                        res.render("admin/login", {status: false, message: "Invalid Password"});
                    }
                }
                else{
                    res.render("admin/login", {status: false, message: "Email address not exist"});
                }
            }
        }
        catch (err) {
            console.log(err);
            res
                .status(500)
                .json({errors: {msg: err}});
        }
    }

}

module.exports = adminController;


