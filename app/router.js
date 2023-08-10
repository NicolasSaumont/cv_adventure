const { Router } = require('express');
const router = Router();


router.get('/', (req, res) => {
    res.render(`index.ejs`);
});

router.get('/library', (req, res) => {
    res.render(`library.ejs`);
});

module.exports = router;