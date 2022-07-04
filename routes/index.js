const express = require('express')
const router = express.Router()
const fs = require('fs')
const axios = require('axios')
const { checkCookie } = require('../helper/cookies')





router.get('/', (req,res)=>{
    const { cookies } = req
    res.render('homepage', {loggedIn: cookies.login?true:false})
})

router.get('/play', checkCookie, (req,res)=>{
    const { cookies } = req
    res.render('play', {username: cookies.login.username})
})

router.get('/getUser', (req,res)=>{
    fs.readFile('./dataUser.json','utf-8', (err, data) => {
        if(err){
            return res.status(500).json({status:'error'})
        }
        return res.status(200).json({data:JSON.parse(data)})
     })
})

router.get('/login', (req,res)=>{
    const { cookies } = req
    res.render('login', {loggedIn: cookies.login?true:false})
})

router.post('/login', (req,res)=>{
    const { username, password } = req.body
    // res.status(200).json({message:'login succeed', status:'succeed'}).redirect('homepage')
    // return res.render('homepage')
    axios.get('http://localhost:5000/getUser')
    .then(({data})=>{
        const dataLogin = data.data.users.filter((val)=>val.username==username)[0]
        if(!dataLogin || dataLogin.password !== password){
            res.status(401).json({message:'wrong username/password', status:'failed'})
        }else{
            res.cookie('login', {username}, 1)
            res.status(200).json({message:'login succeed', status:'succeed', redirected:'/'})
        }
    })
    .catch(err=>{console.log(err)})
})

router.get('/logout', (req,res)=>{
    res.clearCookie('login')
    res.status(200).json({message:'logout succeed', status:'succeed', redirected:'/'})
    res.end()
})


module.exports = router