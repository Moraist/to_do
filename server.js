const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { urlencoded } = require('body-parser');

//APP SETUP
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

// MONGOOSE CONNECTION
mongoose.connect('mongodb://localhost:27017/todolist');

// DB SETUP 
const taskSchema = new mongoose.Schema({
    date: {
        type: String,
        require: true
    },
    task: {
        type: String,
        require: true
    }
});

const Task = mongoose.model('tasks', taskSchema);

/*-- --*/

// DATE HANDLER

var date = new Date();
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();

if (month < 10) month = "0" + month;
if (day < 10) day = "0" + day;

var today = year + "-" + month + "-" + day;



app.get('/', (req, res) => {

    Task.find({date: today}, (err, doc)=>{
        res.render('index', {
            list: doc,
            todayDate: today
        })
    });
});

app.post('/', (req, res)=>{

    if (req.body.date != '' && req.body.newTask != ''){
        
        const taskCreate = new Task ({
        date: req.body.date,
        task: req.body.newTask
        });
        
        if(taskCreate){
            taskCreate.save()
        }
    }
    res.redirect('/');
});

app.get('/update/:id', (req, res)=>{
    
    Task.findOne({_id: req.params.id.trim()}, (err, doc)=>{
        
        res.render('update', {
            task: doc
        })

    })
});

app.post('/update', (req, res )=>{

    Task.updateOne({
        _id: req.body.id}, 
        
        {
        task: req.body.changeTask, 
        date: req.body.date}, 
        
        (err, doc)=> {
        res.redirect('/')
    })
});

app.get('/delete/:id', (req, res)=>{

    Task.deleteOne({_id: req.params.id.trim()}, ()=>{
        res.redirect('/search?dateinit=' + today)
        })
});

app.get('/search', (req, res)=>{

    today = req.query.dateinit;

    Task.find({date: req.query.dateinit}, (err, doc)=>{
        res.render('index', {
            list: doc,
            todayDate: req.query.dateinit
        })
    });

});

app.listen(3000, ()=> 
    console.log('Listening at port 3000'))