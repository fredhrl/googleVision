const express = require('express');
const multer = require('multer');
const ocr = require('./google-ocr');

const app = express();
const upload = multer({dest: './upload'});

app.set('view engine','ejs');
app.get('/',function(req,res){
    res.render("index");
});
app.post('/',upload.single('file'),function(req,res){
    const response = ocr.extract(req.file.path,req.file.path);
    res.json({response});
});

app.listen(3000,function(){ 
    console.log('foi')
});
