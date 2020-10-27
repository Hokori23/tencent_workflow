import { Line } from '@vo';
import { Transaction } from 'sequelize/types';

/**
 * 新增单个节点
 * @param { Line } line
 */
const Create = (line: Line): Promise<Line> => {
  return line.save();
};

/**
 * 批量新增/更新线
 * @param { Array<Node> } bulkNodes
 * @param { Transaction } t
 */
const CreateOrUpdate__Bulk = (
  bulkLines: Array<Line>,
  t: Transaction
): Promise<Line[]> => {
  return Line.bulkCreate(bulkLines, {
    validate: true,
    transaction: t,
    updateOnDuplicate: Object.keys(bulkLines[0])
  });
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

/**
 * 删除线
 * @param { number } id
 * @param { Transaction } t
 */
const Delete = (id: number, t?: Transaction): Promise<number> => {
  return Line.destroy({
    where: { id },
    transaction: t
  });
};

export default { Create, CreateOrUpdate__Bulk, Retrieve__All, Delete };
