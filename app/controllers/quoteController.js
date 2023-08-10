
const quoteController = {
    getSnackQuote: async (req, res) => {
        try {
            const snackQuote = await dataMapper.getSnackQuoteRequest();
            return snackQuote;
        } catch (error) {
            console.trace(error);
            res.status(500);
        }
    }

};


module.exports = quoteController;
