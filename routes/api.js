const express = require("express");
const router = express.Router();
// const auth = require("../middleware/auth");
const hotelController = require("../controllers/HotelsController");
const waiterController = require("../controllers/WaiterController");

/*
Hotels API
*/
router.post('/createHotel',hotelController.createHotel);
router.post('/generateQrCodeForTables',hotelController.assignWaiterToTables);
router.post('/createWaiter',waiterController.addWaiter);
// router.get('/getallHotelTables',hotelController.getallHotelTables);
// router.post('/searchPatient' ,auth,patientController.searchPatient);
// router.post('/searchPatientByLandingPage' ,patientController.searchPatientByLandingPage);
// router.get('/removePatient/:id',auth ,patientController.removePatient);
// router.post('/updatePatientWithTested' ,auth ,patientController.updatePatientWithTested);
// router.get('/getAllNewestUntestedPatients',auth ,patientController.getAllNewestUntestedPatients);
// router.get('/getAllNewestTestedPatients',auth ,patientController.getAllNewestTestedPatients);
// router.get('/getAllOldestUntestedPatients',auth ,patientController.getAllOldestUntestedPatients);
// router.get('/getAllOldestTestedPatients',auth ,patientController.getAllOldestTestedPatients);
// router.post('/updateRapidTestPatientResults',auth ,patientController.updateRapidTestPatientResults);


module.exports = router;