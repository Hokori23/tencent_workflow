const EXPRESS = require('express');

const APP = EXPRESS();

// parse application/x-www-form-urlencoded
APP.use(EXPRESS.urlencoded({ extended: true }));
// parse application/json
APP.use(EXPRESS.json());


module.exports = APP;
