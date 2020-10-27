import { FlowAction as Action, NodeAction, LineAction } from '@action';
import { Flow, Node, Line } from '@vo';
import { Restful } from '@public';
import DB from '@database';

/**
 * 新增流程
 * @param { Flow } flow
 */
const Create = async (flow: Flow): Promise<Restful> => {
  try {
    flow = await Action.Create(flow);
    return new Restful(0, '创建成功', flow.toJSON());
  } catch (e) {
    return new Restful(99, `创建流程失败, ${e.message}`);
  }
};

/**
 * 批量更新流程
 * @param { number } id
 * @param { Array<Node> } bulkNodes
 * @param { Array<Line> } bulkLines
 */
const Update__Bulk = async (
  id: number,
  bulkNodes: Array<Node> = [],
  bulkLines: Array<Line> = []
): Promise<Restful> => {
  const t = await DB.transaction();
  try {
    const flow = await Action.Retrieve(id);
    if (!flow) {
      return new Restful(1, '流程不存在');
    }
    const hasNodes = bulkNodes && bulkNodes.length;
    const hasLines = bulkLines && bulkLines.length;
    console.log(hasNodes, hasLines);
    if (!hasNodes && !hasLines) {
      return new Restful(2, '无更新');
    }
    const promises: Array<Promise<any>> = [];
    hasNodes &&
      promises.push(NodeAction.CreateOrUpdate__Bulk(<Array<Node>>bulkNodes, t));
    hasLines &&
      promises.push(LineAction.CreateOrUpdate__Bulk(<Array<Line>>bulkLines, t));

    await Promise.all(promises);
    await t.commit();
    return new Restful(0, '更新流程成功', {
      nodes: bulkNodes,
      lines: bulkLines
    });
  } catch (e) {
    await t.rollback();
    return new Restful(99, `更新流程失败, ${e.message}`);
  }
};

/**
 * 删除流程
 * @param { number } id
 */
const Delete = async (id: number): Promise<Restful> => {
  try {
    const deleteRow = await Action.Delete(id);
    return deleteRow > 0
      ? new Restful(0, '删除成功')
      : new Restful(1, '删除失败');
  } catch (e) {
    return new Restful(99, `删除流程失败, ${e.message}`);
  }
};

/**
 * 遍历流程
 */
const Retrieve__All = async (): Promise<Restful> => {
  try {
    const flows = await Action.Retrieve__All();
    return new Restful(
      0,
      '查询成功',
      flows.map((flow) => {
        return flow?.toJSON();
      })
    );
  } catch (e) {
    return new Restful(99, `遍历流程失败, ${e.message}`);
  }
};

const Retrieve = async (id: number): Promise<Restful> => {
  try {
    const promises: Array<Promise<any>> = [
      NodeAction.Retrieve__All(id),
      LineAction.Retrieve__All(id)
    ];
    const promiseValues = await Promise.all(promises);
    const [nodes, lines] = promiseValues;
    return new Restful(0, '查询成功', { nodes, lines });
  } catch (e) {
    return new Restful(99, `查询流程信息失败, ${e.message}`);
  }
};

export default {
  Create,
  Update__Bulk,
  Delete,
  Retrieve__All,
  Retrieve
};
