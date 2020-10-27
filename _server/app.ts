import { Flow as FlowRouter, Node as NodeRouter, Line as LineRouter } from '@routes';
const EXPRESS = require('express');

const APP = EXPRESS();

// parse application/x-www-form-urlencoded
APP.use(EXPRESS.urlencoded({ extended: true }));
// parse application/json
APP.use(EXPRESS.json());

APP.use('/flow', FlowRouter);
APP.use('/node', NodeRouter);
APP.use('/line', LineRouter);
module.exports = APP;
