const mainController = {

    homePage(req, res) {
        res.render('index.ejs');
    },

    getToLibrary(req, res) {
            res.render('library.ejs');
    },

    getToCityHall(req, res) {
            res.render('cityHall.ejs');
    },


}

module.exports = mainController;