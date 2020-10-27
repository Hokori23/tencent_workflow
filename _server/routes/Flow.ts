import EXPRESS from 'express';

import { FlowService as Service } from '@service';
import { Flow } from '@vo';
import { Restful, checkIntegrity, isUndef } from '@public';

const ROUTER = EXPRESS.Router();

ROUTER.post('/create', async (req, res, next) => {
  const flow = Flow.build(req.body);
  if (!checkIntegrity(flow, ['text'])) {
    res.status(200).json(new Restful(98, '流程名不能为空'));
    return next();
  }
  try {
    res.status(200).json(await Service.Create(flow));
  } catch (e) {
    res.status(500).end();
  }
  next();
});

ROUTER.post('/update', async (req, res, next) => {
  let { id, nodes, lines } = req.body;
  if (isUndef(id)) {
    res.status(200).json(new Restful(98, '流程ID不能为空'));
    return next();
  }
  try {
    res.status(200).json(await Service.Update__Bulk(id, nodes, lines));
  } catch (e) {
    res.status(500).end();
  }
  next();
});

ROUTER.get('/get', async (req, res, next) => {
  const { id } = req.query;
  if (isUndef(id)) {
    res.status(200).json(new Restful(98, '流程ID不能为空'));
    return next();
  }
  try {
    res.status(200).json(await Service.Retrieve(id));
  } catch (e) {
    res.status(500).end();
  }
  next();
});

ROUTER.get('/get-all', async (req, res, next) => {
  try {
    res.status(200).json(await Service.Retrieve__All());
  } catch (e) {
    res.status(500).end();
  }
  next();
});

ROUTER.post('/delete', async (req, res, next) => {
  const { id } = req.body;
  if (isUndef(id)) {
    res.status(200).json(new Restful(98, '流程ID不能为空'));
    return next();
  }
  try {
    res.status(200).json(await Service.Delete(id));
  } catch (e) {
    res.status(500).end();
  }
  next();
});

export default ROUTER;
