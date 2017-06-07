const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//stores port as key value pairs for heroku deployment or 3000 as local port
const port = process.env.PORT || 3000;
var app = express();

//boilerplate for webpages, 
hbs.registerPartials(__dirname + '/views/partials');

//sets various express related configurations key value pair used here
app.set('view engine', 'hbs');

//next exists so u can tell express when middleware function is done
//middleware to keep track of logs
app.use((req, res, next)  => {
    //req info is in api documentation
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`
    console.log(log);
    fs.appendFile(`server.log`, log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log')
        }
    });
    next();
});

// //render maintenance hbs
// app.use((req, res, next) => {
//     res.render('maintenance.hbs')
// });

//express middleware configure how your express application works
//takes middleware function you want to use (app.use)
//_dirname variable stores path to project directory(node-web-server)
app.use(express.static(__dirname + '/public'));


//register function partials 
//two arguments name and functino to run
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

//helper to uppercase values, takes text to scream
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//handler for http get request
//root of the app /, second argument (function to run)
//request - stores information about what's coming in
//response - methods available to use to respond to request
// app.get('/', (req, res) => {
//     // res.send('<h1>hello express</h1>');
//     res.send({
//         name: 'Matt',
//         likes: [
//             'Carpentry',
//             'Baseball'
//         ]
//     });
// });

//home route
app.get('/', (req, res) => {
   res.render('home.hbs', {
       pageTitle: 'Home Page',
       welcomeMessage: 'Matt'
   });
});

//additonal route (About)
app.get('/about', (req, res) => {
   res.render('about.hbs', {
       pageTitle: 'About Page'
    //    currentYear: new Date().getFullYear()
   });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects'
    });
});

// /bad
app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to submit request'
    });
});

//making port dynamic from 3000 to deploy in heroku
//call app.listen to bind application to a port on our machine
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
