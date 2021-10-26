const WaiterModel = require("../models/Waiters");
const { check, validationResult } = require("express-validator");
const qr = require("qrcode");

const waiterController = {

    addWaiter: async (request, response) => {

        console.log("====== Waiter Create API =======");
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
            const waiterByPhone = await WaiterModel.findOne({phone: body.phone});
            if (waiterByPhone) {
                return response
                    .status(422)
                    .json({errors: [{msg: "Waiter with this phone number already exists"}]});
            }

            let waiterObj = {
                name: body.name,
                phone: body.phone,
                email: body.email,
                address: body.age,
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
                .json({errors: {msg: err}});
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
                .json({errors: {msg: err}});
        }
    }
}

module.exports = waiterController;
