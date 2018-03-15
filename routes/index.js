var taskRoutes = require('./task_routes');

module.exports = function(app, passport){
	taskRoutes(app, passport);
};

// module.exports = function(app, db){
// 	taskRoutes(app, db);
// };