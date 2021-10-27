const HotelModel = require("../models/Hotels");
const WaiterModel = require("../models/Waiters");
const CONSTANT = require("../config/constants");
const domainUrl = CONSTANT.domainUrl;
const { check, validationResult } = require("express-validator");
const QRCode = require('qrcode')

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

        // const errors = validationResult(request);
        //
        // if (!errors.isEmpty()) {
        //     return response
        //         .status(422)
        //         .json({errors: errors.array()});
        // }
        try {
            // check if there is any record with same hotel name
            const hotelByName = await HotelModel.findOne({name: body.name});
            if (hotelByName) {
                return response
                    .status(422)
                    .json({errors: [{msg: "Hotel with this Name already exists"}]});
            }

            let hotelObj;
            hotelObj = {
                name: body.name,
                phone: body.phone,
                email: body.email,
                address: body.address,
            };

            let hotel = new HotelModel(hotelObj);
            await hotel.save();

            response
                .status(200)
                .json({
                    hotel,
                    msg: "Hotel is successfully created."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({errors: {msg: err}});
        }
    },

    getAllHotels: async (request, response) =>{

        console.log("====== Hotel Get All API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));

        try {
                // get all hotels
            let hotels = await HotelModel.find();
            response
                .status(200)
                .json({
                    hotels,
                    msg: "Hotels found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({errors: {msg: err}});
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
                    newHotelArr,
                    msg: "Qr Codes found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({errors: {msg: err}});
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
                .json({errors: {msg: err}});
        }
    },

    assignWaiterToTables : async (request,response ) => {

        console.log("====== Generate QR Code To Tables =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

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
            console.log(`equal Parts Array `+JSON.stringify(breakIntoParts(10, 3)));

            for(let i=0;i<noOfAssignedTables.length ; i++){
                let value = noOfAssignedTables[i];
                let waiterId = waitersArr[i];

                let waiterDetail = await WaiterModel.findOne({_id:waiterId});
                let hotelDetail = await HotelModel.findOne({_id:hotelId});

                 // generate QR Code for each table
                let qrCodeObj = {
                    hotelName   : hotelDetail.name,
                    waiterName  : waiterDetail.name,
                    waiterPhone : waiterDetail.phone,
                };
                qrCodeObj = JSON.stringify(qrCodeObj);
                console.log(JSON.parse(qrCodeObj));

                //                    hotelLogo   : hotelDetail.logo,
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

            console.log(tables);
            let updatedHotelObj =  await HotelModel.findOneAndUpdate({_id: hotelId},
                {   $push: { tables: tables } },  {new: true});

            // console.log("New Hotel Obj");
            // console.log(updatedHotelObj);

            response
                .status(200)
                .json({
                    updatedHotelObj,
                    msg: "Qr Code Generated Successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({errors: {msg: err}});
        }

    }
}

module.exports = hotelController;
