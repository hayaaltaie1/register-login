const express = require('express')
const app = express()

require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(express.json())

const dbConnection = require('./config/database')
const AuthModel = require('./models/auth')

dbConnection();

//Register
app.post('/register' , async(req,res)=>{
    const {email, password} = req.body;

    const user = await AuthModel.findOne({email})
    if(user){
        return res.json({message : 'user already exist'})
    }
    const hashedpassword= bcrypt.hashSync(password , 10);

    const newUser = new AuthModel({
        email : email,
        password : hashedpassword
    })
    await newUser.save()
    res.json({message : 'new user added'})
})

//Login
app.post('/login' , async(req,res)=>{
    const {email,password} = req.body;

    const user = await AuthModel.findOne({email})
    if(!user){
        return res.json({message : 'you are not registered'})
    }

    const validPass = await bcrypt.compare(password , user.password);
    if(!validPass){
        return res.json({message : 'email or password is not correct'})
    }

    const token = jwt.sign({id: user._id} , process.env.SECRET_KEY)

    return res.json({token , user})
})

app.listen(process.env.PORT , ()=>{
    console.log('server is running');

})