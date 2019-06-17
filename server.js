console.log("hello");
const fs = require('fs');
const ws = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const es = express();
const config={};

es.use(bodyParser.json());
es.use(bodyParser.urlencoded(({extended:true})));
fs.readFile(`./config/clockLines.json`, 'utf8', (err, data) => {
    if (err) console.log(err + '');
    else
    {
        config.clockLines = JSON.parse(data);
    }
});
fs.readFile(`./config/system.json`, 'utf8', (err, data) => {
    if (err) console.log(err + '');
    else
    {
        config.system = JSON.parse(data).system;
    }
});
fs.readFile(`./config/schedule.json`, 'utf8', (err, data) => {
    if (err) console.log(err + '');
    else
    {
        config.schedule = JSON.parse(data).schedule;
    }
});

es.get('/schedule', (req, res) => {
    fs.readFile(`${__dirname}/config/schedule.json`, 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    })

});
es.get('/system', (req, res) => {
    fs.readFile(`${__dirname}/config/system.json`, 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    })

});
es.get('/clockLines', (req, res) => {
    fs.readFile(`${__dirname}/config/clockLines.json`, 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    })

});
es.post('/clockLines',(req, res) => {
   let request=req.body;
   for (let c of config.clockLines){
       if (c.id===request.id)  {
           res.status(400).send(`Clock Line with id "${request.id}" is already exist.`);
           return;
       }
   }
   config.clockLines.push(request);
   let json=JSON.stringify(config.clockLines,null,2);
   fs.writeFile(`${__dirname}/config/clockLines.json`,json,'utf8',(err)=>{
       console.log(err);
   });
   res.sendStatus(200);

});



es.listen(3000, () => console.log('Express started at port 3000! Folder: ' + __dirname));
