console.log("hello");
const fs = require('fs');
const ws = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const es = express();
const config={clockLines:[]};

es.use(bodyParser.json());
es.use(bodyParser.urlencoded(({extended:true})));

fs.readFile(`./config/clockLines.json`, 'utf8', (err, data) => {
    if (err) console.log(err + '');
    else
    {
        let parsedData=JSON.parse(data);
        for (let line of parsedData){
            if (!line) continue;
            config.clockLines[line.id]=line;
        }
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
        res.json(JSON.parse(config.schedule));
});
es.get('/system', (req, res) => {
    res.json(JSON.parse(config.system));
});
es.get('/clockLines', (req, res) => {
    res.json(config.clockLines);
});
es.get('/clockLines/:id', (req, res) => {

    let line=config.clockLines[Number(req.params.id)];
    if (line){
        res.json(line);
    }
    else
    {
        res.sendStatus(404);
    }
});
es.post('/clockLines',(req, res) => {
   let request=req.body;
   let id=Number(request.id);
   if (config.clockLines[id])
   {
       res.status(400).send(`Clock line with id "${request.id}" is already exist.`);
   }
   else
   {
       config.clockLines[id]=request;
       fs.writeFile(`${__dirname}/config/clockLines.json`,JSON.stringify(config.clockLines,null,2),'utf8',(err)=>{
           console.log(err);
           res.sendStatus(200);
       });

   }
});
es.put('/clockLines',(req, res) => {
    let request=req.body;
    let id=Number(request.id);
    if (!config.clockLines[id])
    {
        res.status(400).send(`Cannot find clock line with id "${request.id}"`);
        return;
    }
    config.clockLines[id]=request;
    fs.writeFile(`${__dirname}/config/clockLines.json`,JSON.stringify(config.clockLines,null,2),'utf8',(err)=>{
        console.log(err);
        res.sendStatus(200);
    });

});
es.delete('/clockLines/:id',(req,res)=>{
    config.clockLines[Number(req.params.id)] = null;
    fs.writeFile(`${__dirname}/config/clockLines.json`,JSON.stringify(config.clockLines,null,2),'utf8',(err)=>{
        console.log(err);
        res.sendStatus(200);
    });

});



es.listen(3000, () => console.log('Express started at port 3000! Folder: ' + __dirname));
