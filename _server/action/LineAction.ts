import { Line } from '@vo';
import { Transaction } from 'sequelize/types';

/**
 * 批量新增/更新线
 * @param { Array<Node> } bulkNodes
 * @param { Transaction } t
 */
const CreateOrUpdate__Bulk = (
  bulkLines: Array<Line>,
  t: Transaction
): Promise<Line[]> => {
  return Line.bulkCreate(bulkLines, { validate: true, transaction: t });
};

/**
 * 遍历某流程线
 * @param { number } flow_id
 */
const Retrieve__All = (flow_id: number): Promise<Array<Line | null>> => {
  return Line.findAll({
    where: { flow_id }
  });
};

export default {
  CreateOrUpdate__Bulk,
  Retrieve__All
};
