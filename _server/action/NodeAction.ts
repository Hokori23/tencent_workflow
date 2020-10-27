import { Node } from '@vo';
import { Transaction } from 'sequelize/types';

/**
 * 新增单个节点
 * @param { Node } node
 */
const Create = (node: Node): Promise<Node> => {
  return node.save();
};

/**
 * 批量新增/更新节点
 * @param { Array<Node> } bulkNodes
 * @param { Transaction } t
 */
const CreateOrUpdate__Bulk = (
  bulkNodes: Array<Node>,
  t: Transaction
): Promise<Node[]> => {
  return Node.bulkCreate(bulkNodes, {
    validate: true,
    transaction: t,
    updateOnDuplicate: Object.keys(bulkNodes[0])
  });
};

/**
 * 遍历某流程节点
 * @param { number } flow_id
 */
const Retrieve__All = (flow_id: number): Promise<Array<Node | null>> => {
  return Node.findAll({
    where: { flow_id }
  });
};

/**
 * 删除节点
 * @param { number } id
 * @param { Transaction } t
 */
const Delete = (id: number, t?: Transaction): Promise<number> => {
  return Node.destroy({
    where: { id },
    transaction: t
  });
};

export default { Create, CreateOrUpdate__Bulk, Retrieve__All, Delete };
