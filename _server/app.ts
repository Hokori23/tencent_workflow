import { FlowService } from '@service';
import { Restful, checkIntegrity, isUndef } from '@public';
import { Flow, Node, Line } from '@vo';

const EXPRESS = require('express');

const APP = EXPRESS();

// parse application/x-www-form-urlencoded
APP.use(EXPRESS.urlencoded({ extended: true }));
// parse application/json
APP.use(EXPRESS.json());

APP.post('/create-flow', async (req, res) => {
  const flow = Flow.build(req.body);
  if (!checkIntegrity(flow, ['text'])) {
    res.status(200).json(new Restful(98, '流程名不能为空'));
    return;
  }
  try {
    res.status(200).json(await FlowService.Create(flow));
  } catch (e) {
    res.status(500).end();
  }
});

APP.post('/update', async (req, res) => {
  let { id, nodes, lines } = req.body;
  if (isUndef(id)) {
    res.status(200).json(new Restful(98, '流程ID不能为空'));
    return;
  }
  try {
    nodes = nodes
      ? nodes.map((node) => {
          return Node.build(node);
        })
      : [];
    lines = lines
      ? lines.map((line) => {
          return Line.build(line);
        })
      : [];
    res.status(200).json(await FlowService.Update__Bulk(id, nodes, lines));
  } catch (e) {
    res.status(500).end();
  }
});

APP.get('/get', async (req, res) => {
  const { id } = req.query;
  if (isUndef(id)) {
    res.status(200).json(new Restful(98, '流程ID不能为空'));
    return;
  }
  try {
    res.status(200).json(await FlowService.Retrieve(id));
  } catch (e) {
    res.status(500).end();
  }
});

APP.get('/get-all', async (req, res) => {
  try {
    res.status(200).json(await FlowService.Retrieve__All());
  } catch (e) {
    res.status(500).end();
  }
});

APP.post('/delete', async (req, res) => {
  const { id } = req.query;
  if (isUndef(id)) {
    res.status(200).json(new Restful(98, '流程ID不能为空'));
    return;
  }
  try {
    res.status(200).json(await FlowService.Delete(id));
  } catch (e) {
    res.status(500).end();
  }
});
module.exports = APP;
