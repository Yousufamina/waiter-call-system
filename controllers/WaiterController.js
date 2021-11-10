const WaiterModel = require("../models/Waiters");
const HotelModel = require("../models/Hotels");
const { check, validationResult } = require("express-validator");
const qr = require("qrcode");

const waiterController = {

    addWaiter: async (request, response) => {

        console.log("====== Waiter Create API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));

        try {
            // check if there is any record with same hotel name
            const waiterByPhone = await WaiterModel.findOne({phone: body.phone});
            if (waiterByPhone) {
                return response
                    .status(422)
                    .json({msg:"Waiter with this phone number already exists"});
            }

            let waiterObj = {
                name: body.name,
                phone: body.phone,
                email: body.email,
                age: body.age,
                hotelId: body.hotelId
            };

            let waiter = new WaiterModel(waiterObj);
            await waiter.save();

            response
                .status(200)
                .json({
                    waiter,
                    msg: "Waiter is successfully added."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getWaitersByHotelId: async (request, response) => {

        console.log("====== Waiter Get All API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));


        const body = JSON.parse(JSON.stringify(request.body));

        try {
            // get all waiters of hotel
            let waiters = await WaiterModel.find({hotelId: body.hotelId});

            response
                .status(200)
                .json({
                    waiters,
                    msg: "Waiters found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getWaitersByHotel: async (request, response) => {

        console.log("====== Waiter Get By Hotel API =======");
        console.log(request.query.hotelId)
        try {
            // get all waiters of hotel
            let waiters = await WaiterModel.find({hotelId:request.query.hotelId});

            response
                .status(200)
                .json({
                    status:true,
                    waiters,
                    msg: "Waiters found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getAllWaiters: async (request, response) => {

        console.log("====== Waiter Get All API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));

        try {
            // get all waiters of hotel
            let waiters = await WaiterModel.find().populate('hotelId').exec();
                console.log(waiters);
            response
                .status(200)
                .json({
                    status:true,
                    waiters,
                    msg: "Waiters found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },
}

module.exports = waiterController;
