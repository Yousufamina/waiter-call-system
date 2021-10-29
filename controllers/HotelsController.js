const HotelModel = require("../models/Hotels");
const WaiterModel = require("../models/Waiters");
const CONSTANT = require("../config/constants");
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
        console.log(request.body);
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
            let logo ='';
            if(request.files) {
                var image = false;
                var file = request.files;
                for (var k in file) {
                    if (file[k].fieldname == 'logo') {
                        image = file[k];
                        break;
                    }
                }
                if (image) {
                    let fileName = new Date().getTime() + "." + image.originalname.split('.').pop();
                    logo = '/images/' + image.filename +fileName;
                    console.log(image.path+fileName);
                    console.log("logo");
                    console.log(logo);

                    fs.readFile(image.path, function read(err, data) {
                        if (err) {
                            console.log(err);
                        }
                        let content = data;
                        // console.log("ceon",content);

                        if (!err && image.filename != undefined && content) {
                            let file = dbx.filesUpload({ path: '/' + fileName, contents: content })
                                .then(function (resp) {
                                    // console.log(response.result);
                                    dbx.sharingCreateSharedLinkWithSettings({
                                        path: resp.result.path_display,
                                        "settings": {
                                            "requested_visibility": "public",
                                            "audience": "public",
                                            "access": "viewer",
                                        }
                                    }).then((e)=>{
                                        // console.log(e.result);
                                        console.log(e.result);
                                        console.log(e.result.url);
                                        logo = e.result.url;
                                        logo = logo.replace("dl=0","raw=1");
                                        let hotelObj;
                                        hotelObj = {
                                            name: body.name,
                                            phone: body.phone,
                                            email: body.email,
                                            address: body.address,
                                            logo:logo
                                        };

                                        let hotel = new HotelModel(hotelObj);
                                        hotel.save();
                                        response
                                            .status(200)
                                            .json({
                                                msg: "Hotel is successfully created."
                                            });

                                    }).catch((err)=>{
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

    }
}

module.exports = hotelController;
