const mainController = {

    homePage(req, res) {
        res.render('index.ejs');
    },

    getToLibrary(req, res) {
            res.render('library.ejs');
    },


}

module.exports = mainController;