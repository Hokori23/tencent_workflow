import { NodeAction as Action, FlowAction } from '@action';
import { Node } from '@vo';
import { Restful } from '@public';
import DB from '@database';

/**
 * 新增单个节点
 * @param { Node } node
 */
const Create = async (node: Node): Promise<Restful> => {
  try {
    node = await Action.Create(node);
    return new Restful(0, '新增节点成功', node.toJSON());
  } catch (e) {
    return new Restful(99, `新增节点失败, ${e.message}`);
  }
};

/**
 * 删除单个节点
 * @param { number } id
 */
const Delete = async (id: number): Promise<Restful> => {
  try {
    const deleteRow = await Action.Delete(id);
    return deleteRow > 0
      ? new Restful(0, '删除节点成功')
      : new Restful(1, '删除节点失败');
  } catch (e) {
    return new Restful(99, `删除节点失败, ${e.message}`);
  }
};

/**
 * 批量新增节点
 * @param { number } flow_id
 * @param { Array<Node> } bulkNodes
 * @param { Transaction } t
 */
const CreateOrUpdate__Bulk = async (
  flow_id: number,
  bulkNodes: Array<Node>
): Promise<Restful> => {
  const t = await DB.transaction();
  try {
    const flow = await FlowAction.Retrieve(flow_id);
    if (!flow) {
      return new Restful(1, '流程不存在');
    }
    bulkNodes = await Action.CreateOrUpdate__Bulk(bulkNodes, t);

    await t.commit();
    return new Restful(
      0,
      '批量新增节点成功',
      bulkNodes.map((node) => {
        return node.toJSON();
      })
    );
  } catch (e) {
    await t.rollback();
    return new Restful(99, `批量新增节点失败, ${e.message}`);
  }
};

/**
 * 遍历某流程节点
 * @param { number } flow_id
 */
const Retrieve__All = async (flow_id: number): Promise<Restful> => {
  try {
    const nodes = await Action.Retrieve__All(flow_id);
    return new Restful(
      0,
      '查询成功',
      nodes.map((node) => {
        return node?.toJSON();
      })
    );
  } catch (e) {
    return new Restful(99, `遍历节点失败, ${e.message}`);
  }
};

export default { Create, Delete, CreateOrUpdate__Bulk, Retrieve__All };
