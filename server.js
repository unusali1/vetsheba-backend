const app=require("./app");

//const cloudinary = require("cloudinary");
const cloudinary = require("./conectCloudinary/cluodinary");

const dotenv = require("dotenv");
const connectDatabase=require("./db/Database.js");

//handling uncought Exception
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server for Handling uncaught exception`);
})

// config
if(process.env.NODE_ENV!=="PRODUCTION"){
  require("dotenv").config({
      path:"config/.env"
  })}
//connect database
connectDatabase();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

//create server 
const server=app.listen(process.env.PORT,()=>{
    console.log(`server listening on http://localhost:${process.env.PORT}`)
})


//Unhandled Promise rejection
process.on("unhandledRejection",(err)=>{
  console.log(`Shutting down server for ${err.message}`);
  console.log(`Shutting down server due to Unhandled Promise rejection`);
  server.close(()=>{
    process.exit(1);
  });
})