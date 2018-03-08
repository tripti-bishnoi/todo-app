var express = require('express');
var router = express.Router();

var tasks = [];

router.get('/', (req, res)=>{
	res.render('index', {title: 'My Day', weather: null, error: null});
});

router.get('/tasks-api', (req, res)=>{
	res.json(tasks);
});

router.post('/tasks-api',(req, res)=>{
	var task = req.body.task;
	tasks.push({ task: task, status: true });
	res.json(tasks);
});

router.delete('/tasks-api/:taskname',(req, res)=>{
	console.log(req.params.taskname);
	tasks = tasks.filter((def)=>{
		return def.task !== req.params.taskname;
	});
	res.json(tasks);
});

module.exports = router;