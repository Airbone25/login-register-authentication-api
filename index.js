const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

let users = [];

app.get('/',(req,res)=>{
    res.send('Login Authentication');
})

app.get('/users',(req,res)=>{
    res.json(users);
})

app.post('/users',async (req,res)=>{
    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(req.body.password,salt)
    const new_user = {
        name: req.body.name,
        password: hashPass
    }
    users.push(new_user);
    res.send('User successfully registered');
})

app.post('/users/login',async (req,res)=>{
    const user = users.find(user => user.name === req.body.name);
    if(user==null){
        res.status(400).send('No user found');
    }
    try{
        if(await bcrypt.compare(req.body.password,user.password)){
            res.send('Login Success')
        }
        else{
            res.send('Login failed. Please check the password');
        }
    }catch{
        res.status(500).send();
    }

})

app.listen(3000,()=>{
    console.log('Server has started!');
})