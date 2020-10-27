import EXPRESS from 'express';

import { NodeService as Service } from '@service';
import { Node } from '@vo';
import { Restful, checkIntegrity, isUndef } from '@public';

const ROUTER = EXPRESS.Router();

ROUTER.post('/create', async (req, res, next) => {
  const node = Node.build(req.body);
  if (!checkIntegrity(node, ['flow_id', 'name', 'x', 'y', 'type'])) {
    res.status(200).json(new Restful(98, '参数错误'));
    return next();
  }
  try {
    res.status(200).json(await Service.Create(node));
  } catch (e) {
    res.status(500).end();
  }
  next();
});

ROUTER.post('/create-multiple', async (req, res, next) => {
  const { id, nodes } = req.body;
  if (isUndef(nodes)) {
    res.status(200).json(new Restful(98, '参数错误'));
    return next();
  }
  try {
    res.status(200).json(await Service.CreateOrUpdate__Bulk(id, nodes));
  } catch (e) {
    res.status(500).end();
  }
  next();
});

ROUTER.post('/delete', async (req, res, next) => {
  const { id } = req.body;
  if (isUndef(id)) {
    res.status(200).json(new Restful(98, '删除节点的ID不能为空'));
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
