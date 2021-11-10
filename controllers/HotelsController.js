const HotelModel = require("../models/Hotels");
const WaiterModel = require("../models/Waiters");
const CallServiceModel = require("../models/CallService");
const helper = require("../helpers/helper");
const CONSTANT = require("../config/constants");
const NumberGeneratorModel = require("../models/NumberGenerator");
const domainUrl = CONSTANT.domainUrl;
const { check, validationResult } = require("express-validator");
const QRCode = require('qrcode')
const fs = require('fs');

const { Dropbox } = require('dropbox'); // eslint-disable-line import/no-unresolved
var dbx = new Dropbox({ accessToken: "RpsR1d1X1B4AAAAAAAAAAQJkKuFNRF2SQZj9wcvado75Dk3N3wfopY72zkkldfRz" });

const opts = {
    errorCorrectionLevel: 'H',
    type: 'png',
    quality: 0.95,
    margin: 1,
    color: {
        dark: '#208698',
        light: '#FFF',
    },
}

const hotelController = {

    createHotel: async (request, response) => {

        console.log("====== Hotel Create API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));

        try {
            // check if there is any record with same hotel name
            const hotelByName = await HotelModel.findOne({name: body.name});
            if (hotelByName) {
                return response
                    .status(422)
                    .json({msg: "Hotel with this Name already exists"});
            }
            const hotelByEmail = await HotelModel.findOne({email: body.email});
            if (hotelByEmail) {
                return response
                    .status(422)
                    .json({msg: "Hotel with this Email already exists"});
            }

             // helper.uploadImage(request,'logo' , function(logo){
             //     helper.uploadImage(request,'menue' , function(menue){
             //     });
             // });

            let logo='';
            let menue='';
            if(request.files) {
                var image = false;
                var image2 = false;
                var file = request.files;
                for (var k in file) {
                    if (file[k].fieldname == 'logo') {
                        image = file[k];
                    }
                    if (file[k].fieldname == 'menue') {
                        image2 = file[k];
                    }
                }
                if (image) {
                    let fileName = new Date().getTime() + "." + image.originalname.split('.').pop();

                    fs.readFile(image.path, function read(err, data) {
                        if (err) {
                            console.log(err);
                        }
                        let content = data;
                        if (!err && image.filename != undefined && content) {
                            let file = dbx.filesUpload({path: '/' + fileName, contents: content})
                                .then(function (resp) {
                                    dbx.sharingCreateSharedLinkWithSettings({
                                        path: resp.result.path_display,
                                        "settings": {
                                            "requested_visibility": "public",
                                            "audience": "public",
                                            "access": "viewer",
                                        }
                                    }).then((e) => {
                                        // console.log(e.result);
                                        console.log(e.result);
                                        console.log(e.result.url);
                                        logo = e.result.url;
                                        logo = logo.replace("dl=0", "raw=1");

                                        if (image2) {
                                            let fileName = new Date().getTime() + "." + image2.originalname.split('.').pop();

                                            fs.readFile(image2.path, function read(err, data) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                let content = data;
                                                if (!err && image2.filename != undefined && content) {
                                                    let file = dbx.filesUpload({path: '/' + fileName, contents: content})
                                                        .then(function (resp) {
                                                            dbx.sharingCreateSharedLinkWithSettings({
                                                                path: resp.result.path_display,
                                                                "settings": {
                                                                    "requested_visibility": "public",
                                                                    "audience": "public",
                                                                    "access": "viewer",
                                                                }
                                                            }).then((e) => {
                                                                // console.log(e.result);
                                                                console.log(e.result);
                                                                console.log(e.result.url);
                                                                menue = e.result.url;
                                                                menue = menue.replace("dl=0", "raw=1");

                                                                let hotelObj;
                                                                hotelObj = {
                                                                    name: body.name,
                                                                    phone: body.phone,
                                                                    email: body.email,
                                                                    address: body.address,
                                                                    logo: logo,
                                                                    menue: menue
                                                                };

                                                                let hotel = new HotelModel(hotelObj);
                                                                hotel.save();
                                                                response
                                                                    .status(200)
                                                                    .json({
                                                                        msg: "Hotel is successfully created."
                                                                    });
                                                            }).catch((err) => {
                                                                console.log(err);
                                                                return resp.send("error").end()
                                                            })
                                                        })
                                                        .catch(function (error) {
                                                            console.error(error);
                                                        });
                                                    console.log(file);
                                                } else {
                                                    console.log("error")
                                                }
                                            });
                                        }
                                    }).catch((err) => {
                                        console.log(err);
                                        return resp.send("error").end()
                                    })
                                })
                                .catch(function (error) {
                                    console.error(error);
                                });
                            console.log(file);
                        } else {
                            console.log("error")
                        }
                    });
                }
            }
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    updateHotel: async (request, response) => {

        console.log("====== Hotel Update API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));
        const id= request.params.id;
        console.log(id);
        try {
            // check if there is any record with same hotel name
            const hotelByName = await HotelModel.findOne({ _id: { $ne: id }, name: body.name });
            if (hotelByName) {
                return response
                    .status(422)
                    .json({msg: "Hotel with this Name already exists"});
            }
            const hotelByEmail = await HotelModel.findOne({ _id: { $ne: id }, email: body.email });
            if (hotelByEmail) {
                return response
                    .status(422)
                    .json({msg: "Hotel with this Email already exists"});
            }


            let logo='';
            let menue='';
            if(request.files) {
                console.log("main if workds")
                var image = false;
                var image2 = false;
                var file = request.files;
                for (var k in file) {
                    if (file[k].fieldname == 'logo') {
                        image = file[k];
                    }
                    if (file[k].fieldname == 'menue') {
                        image2 = file[k];
                    }
                }
                if (image) {
                    let fileName = new Date().getTime() + "." + image.originalname.split('.').pop();
                    fs.readFile(image.path, function read(err, data) {
                        if (err) {
                            console.log(err);
                        }
                        let content = data;
                        if (!err && image.filename != undefined && content) {
                            let file = dbx.filesUpload({path: '/' + fileName, contents: content})
                                .then(function (resp) {
                                    dbx.sharingCreateSharedLinkWithSettings({
                                        path: resp.result.path_display,
                                        "settings": {
                                            "requested_visibility": "public",
                                            "audience": "public",
                                            "access": "viewer",
                                        }
                                    }).then((e) => {
                                        // console.log(e.result);
                                        console.log(e.result);
                                        console.log(e.result.url);
                                        logo = e.result.url;
                                        logo = logo.replace("dl=0", "raw=1");

                                        if (image2) {
                                            let fileName = new Date().getTime() + "." + image2.originalname.split('.').pop();

                                            fs.readFile(image2.path, function read(err, data) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                let content = data;
                                                if (!err && image2.filename != undefined && content) {
                                                    let file = dbx.filesUpload({path: '/' + fileName, contents: content})
                                                        .then(function (resp) {
                                                            dbx.sharingCreateSharedLinkWithSettings({
                                                                path: resp.result.path_display,
                                                                "settings": {
                                                                    "requested_visibility": "public",
                                                                    "audience": "public",
                                                                    "access": "viewer",
                                                                }
                                                            }).then((e) => {
                                                                // console.log(e.result);
                                                                console.log(e.result);
                                                                console.log(e.result.url);
                                                                menue = e.result.url;
                                                                menue = menue.replace("dl=0", "raw=1");

                                                                let hotelObj;
                                                                hotelObj = {
                                                                    name: body.name,
                                                                    phone: body.phone,
                                                                    email: body.email,
                                                                    address: body.address,
                                                                    logo: logo,
                                                                    menue: menue
                                                                };

                                                                let hotel =  HotelModel.findOneAndUpdate({ _id:id }, { $set: hotelObj }, { new: true });
                                                                response
                                                                    .status(200)
                                                                    .json({
                                                                        status:true,
                                                                        msg: "Hotel is successfully updated."
                                                                    });
                                                            }).catch((err) => {
                                                                console.log(err);
                                                                return resp.send("error").end()
                                                            })
                                                        })
                                                        .catch(function (error) {
                                                            console.error(error);
                                                        });
                                                    console.log(file);
                                                } else {
                                                    console.log("error")
                                                }
                                            });
                                        }
                                        else{
                                            let hotelObj;
                                            hotelObj = {
                                                name: body.name,
                                                phone: body.phone,
                                                email: body.email,
                                                address: body.address,
                                                logo: logo
                                            };

                                            let hotel =  HotelModel.findOneAndUpdate({ _id:id }, { $set: hotelObj }, { new: true });
                                            response
                                                .status(200)
                                                .json({
                                                    status:true,
                                                    msg: "Hotel is successfully updated."
                                                });
                                        }
                                    }).catch((err) => {
                                        console.log(err);
                                        return resp.send("error").end()
                                    })
                                })
                                .catch(function (error) {
                                    console.error(error);
                                });
                            console.log(file);
                        } else {
                            console.log("error")
                        }

                    });
                }
                else if(image2){
                    let fileName = new Date().getTime() + "." + image2.originalname.split('.').pop();
                    fs.readFile(image2.path, function read(err, data) {
                            if (err) {
                                console.log(err);
                            }
                            let content = data;
                            if (!err && image2.filename != undefined && content) {
                                let file = dbx.filesUpload({path: '/' + fileName, contents: content})
                                    .then(function (resp) {
                                        dbx.sharingCreateSharedLinkWithSettings({
                                            path: resp.result.path_display,
                                            "settings": {
                                                "requested_visibility": "public",
                                                "audience": "public",
                                                "access": "viewer",
                                            }
                                        }).then((e) => {
                                            // console.log(e.result);
                                            console.log(e.result);
                                            console.log(e.result.url);
                                            menue = e.result.url;
                                            menue = menue.replace("dl=0", "raw=1");

                                            let hotelObj;
                                            hotelObj = {
                                                name: body.name,
                                                phone: body.phone,
                                                email: body.email,
                                                address: body.address,
                                                menue: menue
                                            };

                                            let hotel =  HotelModel.findOneAndUpdate({ _id:id }, { $set: hotelObj }, { new: true });
                                            response
                                                .status(200)
                                                .json({
                                                    status:true,
                                                    msg: "Hotel is successfully updated."
                                                });
                                        }).catch((err) => {
                                            console.log(err);
                                            return resp.send("error").end()
                                        })
                                    })
                                    .catch(function (error) {
                                        console.error(error);
                                    });
                                console.log(file);
                            } else {
                                console.log("error")
                            }
                        });
                }
                else{
                    console.log("else workss")
                    let hotel =  await  HotelModel.findOneAndUpdate({ _id:id }, { $set: body }, { new: true });
                    response
                        .status(200)
                        .json({
                            status:true,
                            msg: "Hotel is successfully updated."
                        });
                }
            }
            else{
                console.log("main else workss")
                let hotel =  await  HotelModel.findOneAndUpdate({ _id:id }, { $set: body }, { new: true });
                response
                    .status(200)
                    .json({
                        status:true,
                        msg: "Hotel is successfully updated."
                    });
            }
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getAllHotels: async (request, response) =>{

        console.log("====== Hotel Get All API =======");

        try {
                // get all hotels
            let hotels = await HotelModel.find();
            response
                .status(200)
                .json({
                    status:true,
                    hotels,
                    msg: "Hotels found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getHotelDetail: async (request, response) =>{

        console.log("====== Hotel Get API =======");
        console.log("Params");
        console.log(request.params.id);

        try {
                // get all hotels
            let hotel = await HotelModel.findOne({_id:request.params.id});
            response
                .status(200)
                .json({
                    status:true,
                    hotel,
                    msg: "Hotel found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    deleteHotel: async (request, response) =>{

        console.log("====== Hotel Delete API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));
        try {
                // get all hotels
            let hotel = await HotelModel.deleteOne({_id:body.id});
            let waiter = await WaiterModel.deleteMany({hotelId:body.id});
            response
                .status(200)
                .json({
                    status:true,
                    msg: "Hotel delete successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getAllQrCodeImagesDetail: async (request, response) =>{

        console.log("====== QrCode Get All Detail API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        try {
                // get all hotels
            let hotels = await HotelModel.find();
            let newHotelArr = [];
            for(let i=0;i<hotels.length;i++)
            {
                let hotel = hotels[i];
                let tables = hotel.tables;
                if(tables.length > 0){
                    for(let k=0;k<tables.length;k++){
                        let table= tables[k];
                        let waiterDetail = await WaiterModel.findOne({_id:table.waiterId});
                        let qrCode = JSON.parse(table.qrCode);
                        let obj = {
                            hotelName : hotel.name,
                            hotelLogo :`${domainUrl}${hotel.logo}`,
                            waiterName : waiterDetail.name,
                            waiterPhone : waiterDetail.phone,
                            qrCodeImage : `${domainUrl}${table.qrCodeImage}`,
                            qrCode : qrCode
                        }
                        newHotelArr = [...newHotelArr, obj] ;
                    }
                }
            }
            response
                .status(200)
                .json({
                    status:true,
                    newHotelArr,
                    msg: "Qr Codes found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getAllQrCodeImages: async (request, response) =>{

        console.log("====== QrCode Get All API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));

        try {
                // get all hotels
            let hotels = await HotelModel.find();
            let newHotelArr = [];
            for(let i=0;i<hotels.length;i++)
            {
                let hotel = hotels[i];
                let tables = hotel.tables;
                if(tables.length > 0){
                    for(let k=0;k<tables.length;k++){
                        let table= tables[k];
                        let obj = {
                            qrCodeImage : `${domainUrl}${table.qrCodeImage}`,
                        }
                        newHotelArr = [...newHotelArr, obj] ;
                    }
                }
            }
            response
                .status(200)
                .json({
                    newHotelArr,
                    msg: "Qr Codes found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getQrCodeImagesOfHotel: async (request, response) =>{

        console.log("====== Get QrCode Of Hotel API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));

        try {

            let hotel = await HotelModel.findOne({_id:body.hotelId});
            let newHotelArr = [];
            let tables = hotel.tables;
            if(tables.length > 0){
                for(let k=0;k<tables.length;k++){
                    let table= tables[k];
                    let waiterDetail = await WaiterModel.findOne({_id:table.waiterId});

                    let qrCode = JSON.parse(table.qrCode);
                    let obj = {
                        hotelName : hotel.name,
                        hotelLogo :`${domainUrl}${hotel.logo}`,
                        waiterName : waiterDetail.name,
                        waiterPhone : waiterDetail.phone,
                        qrCodeImage : `${domainUrl}${table.qrCodeImage}`,
                        qrCode : qrCode
                    }
                    newHotelArr = [...newHotelArr, obj] ;
                }
                response
                    .status(200)
                    .json({
                        newHotelArr,
                        msg: "Qr Codes found successfully."
                    });
            }
            else{
                response
                    .status(200)
                    .json({
                        newHotelArr,
                        msg: "No Tables Added."
                    });
            }
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    assignWaiterToTables : async (request,response ) => {

        console.log("====== Generate QR Code To Tables =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        console.log(request.body);

        const body = JSON.parse(JSON.stringify(request.body));

        try{

              let noOfTables = body.tables;
              let hotelId = body.hotelId;
              let waitersArr = body.waiters;
              let parts = waitersArr.length;
              let tables= [];

              // devide number into equal parts
            const breakIntoParts = (num, parts) =>
                [...Array(parts)].map((_,i) =>
                    0|num/parts+(i < num%parts))

            let noOfAssignedTables = (breakIntoParts(noOfTables, parts));
            console.log(`equal Parts Array `+JSON.stringify(breakIntoParts(noOfTables, parts)));

            for(let i=0;i<noOfAssignedTables.length ; i++){
                let value = noOfAssignedTables[i];

                for(let k=0;k<value ; k++) {

                    let waiterId = waitersArr[i];

                    let waiterDetail = await WaiterModel.findOne({_id:waiterId});
                    let hotelDetail = await HotelModel.findOne({_id:hotelId});

                    // generate QR Code for each table

                    let qrCodeObj = {
                        hotelName   : hotelDetail.name,
                        hotelLogo :`${domainUrl}${hotelDetail.logo}`,
                        waiterName  : waiterDetail.name,
                        waiterPhone : waiterDetail.phone,
                    };
                    qrCodeObj = JSON.stringify(qrCodeObj);
                    console.log(JSON.parse(qrCodeObj));

                    let src = 'barCodes/'+`${Date.now()}.png`;
                    await QRCode.toFile('./public/'+`${src}`,qrCodeObj, opts).then(qrImage => {
                        // console.log("File",qrImage);
                        // console.log(qrImage);

                        let tableObj = { qrCode:qrCodeObj , waiterId :  waiterId , qrCodeImage: src };
                        tables = [...tables, tableObj] ;

                    }).catch(err => {
                        console.error(err)
                    });

                }
            }

            console.log(tables);
            let updatedHotelObj =  await HotelModel.findOneAndUpdate({_id: hotelId},
                {   $push: { tables: tables } },  {new: true});

            console.log("New Hotel Obj");
            console.log(updatedHotelObj);

            response
                .status(200)
                .json({
                    status:true,
                    updatedHotelObj,
                    msg: "Qr Code Generated Successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }

    },

    addTable : async (request,response ) => {

        console.log("====== Add Table API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        console.log(request.body);

        const body = JSON.parse(JSON.stringify(request.body));

        try{
            let hotelId= body.hotelId;
            let hotelDetail = await HotelModel.findOne({_id:hotelId});
            let tables = hotelDetail.tables;

            // get uuid auto generated
            let numberDoc = await NumberGeneratorModel.findOneAndUpdate(
                { name: "uuid" },
                { $inc: { value: 1 } },
                { new: true }
            );
            let value = numberDoc.value;
            let qrCode = (value + "").padStart(4, "0");
            let qrCodeUrl  = CONSTANT.domainUrl+"connect/"+qrCode;
            let img = 'barCodes/'+`${Date.now()}.png`;
            let src = '';
            let fileName =  `${Date.now()}.png`;

            if(tables.length){
                console.log("tables already added");
                // update table
                let len = tables.length+1;
                let tableName = 'Table '+len;
                await QRCode.toFile('./public/'+`${img}`,qrCodeUrl, opts).then(qrImage => {
                    // console.log("File",qrImage);

                    fs.readFile('./public/'+`${img}`, function read(err, data) {
                        if (err) {
                            console.log(err);
                        }
                        let content = data;
                        let file =  dbx.filesUpload({path: '/' + fileName, contents: content})
                            .then(function (resp) {
                                dbx.sharingCreateSharedLinkWithSettings({
                                    path: resp.result.path_display,
                                    "settings": {
                                        "requested_visibility": "public",
                                        "audience": "public",
                                        "access": "viewer",
                                    }
                                }).then((e) => {
                                    console.log(e.result);
                                    console.log(e.result.url);
                                    src = e.result.url;
                                    src = src.replace("dl=0", "raw=1");

                                    let table = {name: tableName,qrCode: qrCode , qrCodeImage: src, status:'InActive' };
                                    let updated = HotelModel.findOneAndUpdate({_id: hotelId},
                                        {   $push: { tables: [table] } },  function(err, doc){
                                            if(err){
                                                console.log("Something wrong when updating data!");
                                            }
                                            else{
                                                console.log("Table added successfully");
                                                response
                                                    .status(200)
                                                    .json({
                                                        status:true,
                                                        msg: "Table added successfully"
                                                    });

                                            }
                                        });

                                }).catch((err) => {
                                    console.log(err);
                                    return resp.send("error").end()
                                })
                            })
                            .catch(function (error) {
                                console.error(error);
                            });
                        console.log(file);
                    });

                    console.log("qrCode generated");
                }).catch(err => {
                    console.error(err)
                });

            }
            else{
                console.log(" first table added");
                // insert first table
                await QRCode.toFile('./public/'+`${img}`,qrCodeUrl, opts).then(qrImage => {

                    fs.readFile('./public/'+`${img}`, function read(err, data) {
                        if (err) {
                            console.log(err);
                        }
                        let content = data;
                        let file =  dbx.filesUpload({path: '/' + fileName, contents: content})
                            .then(function (resp) {
                                dbx.sharingCreateSharedLinkWithSettings({
                                    path: resp.result.path_display,
                                    "settings": {
                                        "requested_visibility": "public",
                                        "audience": "public",
                                        "access": "viewer",
                                    }
                                }).then((e) => {
                                    console.log(e.result);
                                    console.log(e.result.url);
                                    src = e.result.url;
                                    src = src.replace("dl=0", "raw=1");

                                    let table = {name: 'Table 1',qrCode: qrCode , qrCodeImage: src, status:'InActive' };
                                    let updated = HotelModel.findOneAndUpdate({_id: hotelId},
                                        {   $push: { tables: table } },  function(err, doc){
                                            if(err){
                                                console.log("Something wrong when updating data!");
                                            }
                                            else{
                                                console.log("Table added successfully");
                                                response
                                                    .status(200)
                                                    .json({
                                                        status:true,
                                                        msg: "Table added successfully"
                                                    });
                                            }
                                        });

                                }).catch((err) => {
                                    console.log(err);
                                    return resp.send("error").end()
                                })
                            })
                            .catch(function (error) {
                                console.error(error);
                            });
                        console.log(file);
                    });


                }).catch(err => {
                    console.error(err)
                });
            }

        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }

    },

    updateTableName : async (request,response ) => {

        console.log("====== Update Table Name API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));

        try{
            let id= body._id;
            let name= body.name;

            let updated = await  HotelModel.findOneAndUpdate({"tables._id": id},
                {   $set: { "tables.$.name" : name } },  {new: true});

            console.log("updated OBJ");
            console.log(updated);
            console.log("Table name updated successfully");
            response
                .status(200)
                .json({
                    status:true,
                    msg: "Table name updated successfully"
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }

    },

    connect : async (request,response ) => {

        console.log("====== connect  API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        console.log("=== Params: ===" + (request.params.id));

        const body = JSON.parse(JSON.stringify(request.body));

        try{
            let code='';
            if(body.qrCode){
                code = body.qrCode;
            }
            else{
                code = request.params.id;
            }
            let hotel  = await HotelModel.aggregate([{$unwind: "$tables"}, {$match:{"tables.qrCode" :code}}]);
            console.log("hotel");
            console.log(hotel);
            if(hotel.length){
                hotel = hotel[0];
                let tableId = hotel.tables._id;
                let obj = {
                    hotelId: hotel._id,
                    tableId : tableId,
                    tableName : hotel.tables.name,
                    status: "Table"
                };
                let service = new CallServiceModel(obj);
                await service.save();
                console.log("called save func");
                response.render('dashboard',{code:code, logo:hotel.logo ,menue:hotel.menue, hotelName:hotel.name});
            }
            else{
                console.log("Incorrect code")  ;
                response
                    .status(500)
                    .json({
                        msg: "Incorrect code."
                    });
            }
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }

    },

    callService : async (request,response ) => {

        console.log("====== call Waiter Service  API =======");

        console.log(request.params.id);
        let code = request.params.id;
        try{
            let hotel  = await HotelModel.aggregate([{$unwind: "$tables"}, {$match:{"tables.qrCode" :code}}]);
            console.log(hotel);
            if(hotel.length){
                hotel = hotel[0];
                let obj = {
                    hotelId: hotel._id,
                    tableId : hotel.tables._id,
                    tableName : hotel.tables.name,
                    status: "Service"
                };
                let service = new CallServiceModel(obj);
                service.save();
                response
                    .status(200)
                    .json({
                        msg: "Call Waiter successfully called."
                    });
            }
            else{
              console.log("Incorrect code")  ;
                response
                    .status(500)
                    .json({
                        msg: "Incorrect code."
                    });
            }

        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }

    },

    getAllServiceCalls : async (request,response ) => {

        console.log("====== get All Service Calls  API =======");

        try{
            let user = request.session.user;
            console.log("admin user request");
            console.log(user);
            if(user){
                if(user.hotelId){
                    let calls = await CallServiceModel.find({hotelId: user.hotelId,status:{$ne:'Ended'}});
                    response
                        .status(200)
                        .json({
                            status:true,
                            calls:calls,
                            msg: "calls get successfully."
                        });
                }
                else if(user.type == '6189f042f8bae7b5d035a19f'){
                    delete request.session.user;
                    response.render("admin/login", {status: true, message: ""})
                }
            }
            else{
                delete request.session.user;
                response.render("admin/login", {status: true, message: ""});
            }
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }

    },

    endCall : async (request,response ) => {

        console.log("====== endCall  API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));

        try{

            // let call = await CallServiceModel.deleteOne({_id:body.id});
            let call = await CallServiceModel.findOneAndUpdate({ _id:body.id }, { $set: {status:"Ended"} }, { new: true });

            response
                    .status(200)
                    .json({
                        status:true,
                        msg: "Call deleted successfully."
                    });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }

    }
}

module.exports = hotelController;
