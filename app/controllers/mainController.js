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
    },

    getToMemoryGame(req, res) {
            res.render('harbor.ejs');
    },

    getToMysticalForest(req, res) {
            res.render('forest.ejs');
    },

    getToEzee(req, res) {
            res.render('districtCenter.ejs');
    },

    getToTopFiveVideoGames(req, res) {
            res.render('arcadeGameCenter.ejs');
    }

}

module.exports = mainController;