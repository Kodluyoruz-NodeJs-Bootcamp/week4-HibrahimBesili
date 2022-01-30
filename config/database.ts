// import { OperationCanceledException } from "typescript";

// // import config from '../config.json';
// import  mySql from "mysql";

// mySql.createConnection()

// var connectDB = mySql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "12345",
//   database : "sys"
// });

// // connectDB.connect(
// //   function (err) { 
// //   if (err) { 
// //       console.log("!!! Cannot connect !!! Error:");
// //       throw err;
// //   }
// //   else
// //   {
// //      console.log("Connection established.");
// //   }
// // });
// export default connectDB;
import "reflect-metadata";
import { createConnection } from "typeorm";

export default async () => {
  try {
    await createConnection();
    console.log("Database connected successfully");
  } catch (error) {
      throw error;
  }
};
