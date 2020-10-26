import { Flow } from '@vo';

/**
 * 新增流程
 * @param { Flow } flow
 */
const Create = (flow: Flow): Promise<Flow> => {
  return flow.save();
};

/**
 * 删除流程
 * @param { number } id
 */
const Delete = (id: number): Promise<number> => {
  return Flow.destroy({
    where: {
      id
    }
  });
};

/**
 * 查询流程
 * @param { number } id
 */
const Retrieve = (id: number): Promise<Flow | null> => {
  return Flow.findOne({
    where: {
      id
    }
  });
};

/**
 * 遍历流程
 */
const Retrieve__All = (): Promise<Array<Flow | null>> => {
  return Flow.findAll();
};

export default {
  Create,
  Delete,
  Retrieve,
  Retrieve__All
};
