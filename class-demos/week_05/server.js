//import express library
//1. we always import libraries first
const express = require('express');

//2. initialize library
const app = express();

//3. middleware
//stuff that happens between init and app listen
app.use(express.static('assets'));
let allNotes = []  //array to hold all notes submitted
//4. routing
// determines response
app.get('/',(request, response)=>{
    response.send('server is working')
})
app.get('/guestbook',(req, res)=>{
    res.sendFile('')
});
app.get('/submit',(req, res)=>{
    console.log(req.query  )
    let user = req.query.guest
    let message = req.query.note
    let time = Date(Date.bow()).toLocaleString()

    console.log(time)

    const messageData = {
        username: user,
        message: message,
        date: time
    }
    allNotes.push(messageData)
   // res.send('thank you for submitting, ' + user)
   res.redirect('/')
})
app.get('/all-messages',(req, res)=>{
    let messageString = '' //creates local variable string to use tos end ot client
    res.send(messageString)

    // use a loop to go thruogh entire notes array
    for(let n of allNotes){
        messageString += '<h3>' + n.username + '</h3>' + 'says' + n.message
    }
})
res.json({notes: allNotes})
//5. set the app to listen requests
app.listen(3001, () => {
    console.log('server is running on port http://192.168.1.189:3001');
})