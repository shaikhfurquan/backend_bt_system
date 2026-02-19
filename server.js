require("dotenv").config()
const app = require("./src/app")
const connectToDB = require('./src/config/db.config')
const PORT = process.env.PORT
console.log(PORT);

connectToDB()
app.listen(PORT || 3000, () => {
    console.log(`Server is running on port ==> ${PORT}`);
});