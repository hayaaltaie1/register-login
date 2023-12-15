const mongoose = require('mongoose')

const dbConnection =()=>{
    mongoose.connect(process.env.MONGO)
    .then(()=> console.log('database connected'))
    .catch((e)=> console.log(e))

} 


module.exports = dbConnection ;