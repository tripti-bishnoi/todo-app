var Task = require('../models/taskDetails');

module.exports = function(app, passport) {
    //HOME ================================
    app.get('/', (req, res)=>{
        res.render('home', {taskCount : 0});
    });

    //LOGIN ================================
    //show login form
    app.get('/login', (req, res)=>{
        res.render('login', {message : req.flash('loginMessage')}); //passing any flash data if exists
    });

    //process login form
    app.post('/login', passport.authenticate('local-login',{
        successRedirect : '/profile',
        failureRedirect : '/login',
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

    //PROFILE SECTION ================================
    //want this protected, so you have to login
    //will use route middleware for this, isLoggedIn function
    // app.get('/profile', isLoggedIn, (req, res)=>{
    //     res.render('profile', {user : req.user}); //get the user out of session and pass to template
    // });

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

        Task.count({ "completedFlag" : false, user : req.user, addedOn: {"$gte": yesterday, "$lt": today} }, (err, count)=>{
            if(err) throw err;
            countVar = count;
            res.render('index', {todayTaskCount : count});
        });
        // var query = { "completed_flag" : false};
        // db.collection('task_details').count(query, (err, result)=>{
        //     if(err) return console.log(`Error occured while counting: ${err}`);
        //     else {
        //         res.render('index', {todayTaskCount : result});
        //     }
        // });
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

        // db.collection('task_details').find({}).toArray((err, result)=>{
        //     if(err) return console.log(`Error occured while finding all documents: ${err}`);
        //     else {
        //         res.json(result);
        //     }
        // });
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

        // db.collection('task_details').insert(task, (err, result)=>{
        //     if(err) return console.log(`Error occured while inserting: ${err}`);
        // });
    });

    app.put('/tasks-api/:taskdesc', isLoggedIn, (req, res) => {
        Task.update({ desc : req.params.taskdesc, user : req.user}, {desc : req.params.taskdesc, completedFlag: true}, (err, result) => {
            if(err) throw err;
        });

        // var query = { "desc" : req.params.taskdesc };
        // var task = {desc : req.params.taskdesc, completed_flag: true};
        // db.collection('task_details').update(query, task, (err, result)=>{
        //     if(err) return console.log(`Error occured while updating: ${err}`);
        // });
    });

    app.get('/monthlyTasks-api', isLoggedIn, (req, res)=>{
        Task.aggregate([
            { $match: {user : req.user._id}},
            { $unwind: '$addedOn' },
            { $project: {
                _id: 0,
                desc: 1,
                completedFlag: 1,
                addedOn: 1,
                user: 1
            }},
            { $group : {
                _id : {
                    month: { $month: '$addedOn' }},
                total: {$sum: 1}
            }},
            {"$sort": { "month": 1 }}
        ], (err, result)=>{ 
            if(err) throw err;
            res.json(result);
        });
    });

    app.get('/monthlyTasks-api/:monthNum', isLoggedIn, (req, res)=>{
        Task.aggregate([
            {$project: {
                _id: 0,
                desc: 1,
                completedFlag: 1,
                month: {$month: '$addedOn'},
                user: 1
            }},
            {$match: {month: parseInt(req.params.monthNum) }}
            ], (err, result)=>{
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