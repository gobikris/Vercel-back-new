const { MongoClient } = require('mongodb');

const mongo = {

    db: null,
    admin:null,
    products: null,
    users: null,
    orders: null,

    async connect(){
        // get URL
        const client = await new MongoClient(process.env.MONGO_DB_URL);
        await client.connect();
        console.log(`mongoDb is Online ${process.env.MONGO_DB_URL}`);

        // DB Name
        this.db = await client.db(process.env.MONGO_DB_NAME);
        console.log(`db name is ${process.env.MONGO_DB_NAME}`);

        // DB collections
        this.products = this.db.collection("products");
        this.users = this.db.collection("users");
        this.orders = this.db.collection("orders");
        this.admin = this.db.collection("admin");
        console.log(`${process.env.MONGO_DB_NAME} collection initiating`);
    }
}

module.exports = mongo;