const app = require("./app.js");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database.js")


// handling uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`)
    console.log("Shutting down server, due to uncaught exception")
    process.exit(1);
})

// config
dotenv.config({ path:"backend/config/config.env"})

connectDatabase()

app.listen( process.env.PORT , () => {
    console.log( ` Server is working on http:localhost:${process.env.PORT}`)
})




// UnHandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(` error : ${err.message}`)
    console.log("Shutting down server, due to unhandled promise rejection")

    server.close(()=>{
        process.exit(1)
    });
});
