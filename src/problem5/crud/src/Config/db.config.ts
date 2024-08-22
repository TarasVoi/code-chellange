import 'dotenv/config' 
import mongoose from 'mongoose' 

const connectionString = process.env.CONNSTRING


if (!connectionString) {
  console.error('Db connection string is not defined in the .env file');
  process.exit(1);
}

const options = {
  autoIndex: false, 
  maxPoolSize: 10, 
  serverSelectionTimeoutMS: 5000, 
  socketTimeoutMS: 45000,
  family: 4
};

export const db = mongoose.connect(connectionString!, options)
  .then(res => {
    if (res) {
      console.log(`Database connection is succeffully established.`)
    }
  }).catch(err => {
    console.log(err) 
  })