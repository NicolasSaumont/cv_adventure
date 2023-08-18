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

    getToMuseum(req, res) {
            res.render('museum.ejs');
    },

    getToSchool(req, res) {
            res.render('school.ejs');
    }

}

module.exports = mainController;