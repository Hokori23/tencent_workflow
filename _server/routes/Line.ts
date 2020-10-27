import EXPRESS from 'express';

import { LineService as Service } from '@service';
import { Line } from '@vo';
import { Restful, checkIntegrity, isUndef } from '@public';

const ROUTER = EXPRESS.Router();

ROUTER.post('/create', async (req, res, next) => {
  const line = Line.build(req.body);
  if (
    !checkIntegrity(line, [
      'flow_id',
      'text',
      'start_id',
      'end_id',
      'start_anchor',
      'end_anchor',
      'type'
    ])
  ) {
    res.status(200).json(new Restful(98, '参数错误'));
    return next();
  }
  try {
    res.status(200).json(await Service.Create(line));
  } catch (e) {
    res.status(500).end();
  }
  next();
});

ROUTER.post('/delete', async (req, res, next) => {
  const { id } = req.body;
  if (isUndef(id)) {
    res.status(200).json(new Restful(98, '删除连线的ID不能为空'));
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
