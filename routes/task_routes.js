var Task = require('../models/taskDetails');

module.exports = function(app, passport) {
    //HOME ================================
    // app.get('/', (req, res)=>{
    //     res.render('login');
    // });

    //LOGIN ================================
    //show login form
    app.get('/', (req, res)=>{
        res.render('home', {message : req.flash('loginMessage')}); //passing any flash data if exists
    });

    //process login form
    app.post('/login', passport.authenticate('local-login',{
        successRedirect : '/profile',
        failureRedirect : '/',
        failureFlash : true
    }));

    //SIGN UP ================================
    //show signup form
    app.get('/signup', (req, res)=>{
        res.render('signup', {message : req.flash('signupMessage')}); //passing any flash data if exists
    });

    //process signup form
    app.post('/signup', passport.authenticate('local-signup',{
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    //FACEBOOK ROUTES ================================
    //route for fb authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope : ['email'] //by default fb provides user info. add email by specifying scope
    }));

    //handle authentication after fb has authenticated the user
    app.get('/auth/facebook/callback', passport.authenticate('facebook',{
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

    //LOGOUT ================================
    app.get('/logout', (req,res)=>{
        req.logout();
        res.redirect('/');
    });

    // /tasks-api ROUTES ================================
    app.get('/profile', isLoggedIn, (req, res) => {
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var today = new Date();

        Task.find({ "completedFlag" : false, user : req.user }, (err, result)=>{
            if(err) throw err;
            var count = 0;
            result.forEach((r)=>{
                if(r.addedOn >= yesterday && r.addedOn <= today){
                    count += 1;
                }
            });
            res.render('index', {todayTaskCount : count, totalTaskCount: result.length});
        });
    });

    app.get('/tasks-api', isLoggedIn, (req, res)=>{
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var today = new Date();
        
        var query = {
            user : req.user,
            addedOn: {"$gte": yesterday, "$lt": today}
        };
        
        Task.find(query).exec((err, result)=>{
            if(err) throw err;
            res.json(result);
        });
    });

    app.post('/tasks-api', isLoggedIn, (req, res) => {
        var newTask = Task();
        newTask.desc = req.body.desc;
        newTask.completedFlag = false;
        newTask.addedOn = new Date();
        newTask.user = req.user._id;

        newTask.save((err)=>{
            if(err) throw err;
            return newTask;
        });
    });

    app.put('/tasks-api/:taskdesc', isLoggedIn, (req, res) => {
        Task.update({ desc : req.params.taskdesc, user : req.user}, {desc : req.params.taskdesc, completedFlag: true}, (err, result) => {
            if(err) throw err;
        });
    });

    app.get('/todoList', isLoggedIn, (req, res)=>{
        Task.find({ user : req.user }, (err, result)=>{
            if(err) throw err;
            res.json(result);
        });
    });

};

//route middleware to make sure user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}