const express = require("express");
const router = express.Router();
// const auth = require("../middleware/auth");
const hotelController = require("../controllers/HotelsController");
const waiterController = require("../controllers/WaiterController");
const adminController = require("../controllers/adminController");
const key = 'RpsR1d1X1B4AAAAAAAAAAQJkKuFNRF2SQZj9wcvado75Dk3N3wfopY72zkkldfRz';
const appkey = '0yy4ednciwl4ohk';
const appSec = 'viyxtt30n9t6fbk';

const AccessKeyID = 'AKIAUTEYSXV7EUTV3YVN';
const SecretAccessKey =  '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';


/*
Hotels API
*/
router.post('/createHotel',hotelController.createHotel);
router.post('/addTable',hotelController.addTable);
router.post('/updateTableName',hotelController.updateTableName);
router.get('/getAllHotels',hotelController.getAllHotels);
router.get('/hotel/:id',hotelController.getHotelDetail);
router.put('/updateHotel/:id',hotelController.updateHotel);
router.post('/delete/hotel',hotelController.deleteHotel);
router.post('/generateQrCodeForTables',hotelController.assignWaiterToTables);
router.get('/getAllQrCodeImagesDetail',hotelController.getAllQrCodeImagesDetail);
router.get('/getAllQrCodeImages',hotelController.getAllQrCodeImages);
router.post('/getQrCodeImagesOfHotel',hotelController.getQrCodeImagesOfHotel);
router.post('/createWaiter',waiterController.addWaiter);
router.post('/getWaitersByHotelId',waiterController.getWaitersByHotelId);
router.get('/getWaitersByHotel',waiterController.getWaitersByHotel);
router.get('/getAllWaiters',waiterController.getAllWaiters);
router.get('/getAllUsers',adminController.getAllUsers);
router.post('/addUser',adminController.addUser);
router.get('/getAllTypes',adminController.getUserType);
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