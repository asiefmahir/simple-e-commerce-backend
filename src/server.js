const app = require("./app");
const { connectWithDb, uri } = require("./mongo");

const port = process.env.PORT || 5000;

app.listen(port, () => {

    connectWithDb();

    console.log('app is running on port', port);
});