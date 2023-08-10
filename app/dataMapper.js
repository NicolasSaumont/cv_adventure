const client = require('./database.js');

const dataMapper = {
    getSnackQuoteRequest: async () => {
        const sqlQuery = `SELECT * FROM feel_good_quotes ORDER BY RANDOM() LIMIT 1;`;
        const result = await client.query(sqlQuery);
        return result.rows;
    },
};

module.exports = dataMapper;