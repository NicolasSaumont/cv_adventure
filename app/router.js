const { Router } = require('express');
const router = Router();

const mainController = require('./controllers/mainController');


router.get('/', mainController.homePage);

router.get('/library', mainController.getToLibrary);

router.get('/cityHall', mainController.getToCityHall);

router.get('/museum', mainController.getToMuseum);

router.get('/school', mainController.getToSchool);

router.get('/to-fran', mainController.getToFran);

router.get('/to-memory-game', mainController.getToMemoryGame);

router.get('/to-mystical-forest', mainController.getToMysticalForest);

router.get('/to-top-5-video-games', mainController.getToTopFiveVideoGames);

router.get('/to-ezee', mainController.getToEzee);



module.exports = router;