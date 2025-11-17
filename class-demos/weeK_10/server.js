const express = require('express');
const parser = require('body-parser');
const multer = require('multer');
const nedb = require('@seald-io/nedb')

// setup configs for libraries
const encodedParser = parser.urlencoded({ extended: true });
const uploadProcessor = multer({dest: 'public/upload'});

let database = new nedb({
    filename: 'database.txt',
    autoload: true
})
const app = express();

//app.use is middleware happens between setup and routes
app.use(express.static('public'));
app.use(encodedParser)

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: "public"});
});


app.post('/upload', uploadProcessor.single('imgUpload'), (req, res) => {

    console.log(req.body);
    let data = {
        postText: req.body.text,
        timestamp: new Date().toLocaleString(),
        postTimestamp: Date.now(),
    };

    database.insert(data, (err, dataToBeAdded) => {
        if (err) {
            console.error(err);
            return res.redirect('/');
        } else {
            console.log(dataToBeAdded);
            return res.redirect('/');
        }
    });

});
app.listen(6004, () => {
    console.log('Server is running on http://localhost:6004');
});