const mongoose=require('mongoose');

// const connectDatabase=()=>{
//     mongoose.connect(process.env.DB_URL,{
//         useNewUrlParser: true,
//         useUnifiedTopology: true,

//     }).then((data)=>{
//       console.log(`Mongodb is connected with server :${data.connection.host}` );
//     })
// }



const connectDatabase =async(options = {}) =>{
  try {
      await mongoose.connect(process.env.DB_URL,options);
      console.log("MongoDB connection Successful");

      mongoose.connection.on("error",(error)=>{
         console.error("DB Connection Error" , error);
      });
  } catch (error) {
      console.error("Could not connect DB", error.toString());
  }
}




module.exports=connectDatabase;