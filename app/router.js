const { Router } = require('express');
const router = Router();

const mainController = require('./controllers/mainController');


router.get('/', mainController.homePage);

router.get('/library', mainController.getToLibrary);

router.get('/cityHall', mainController.getToCityHall);

module.exports = router;