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
  bulkNodes: Array<Node>,
  bulkLines: Array<Line>
): Promise<Restful> => {
  const t = await DB.transaction();
  try {
    const flow = await Action.Retrieve(id);
    if (!flow) {
      return new Restful(1, '流程不存在');
    }
    const promises: Array<Promise<any>> = [
      NodeAction.CreateOrUpdate__Bulk(bulkNodes, t),
      LineAction.CreateOrUpdate__Bulk(bulkLines, t),
      NodeAction.Retrieve__All(id)
    ];
    let promiseValues = await Promise.all(promises);
    bulkNodes = promiseValues.pop();
    bulkLines = promiseValues.pop();
    let nodes = promiseValues.pop();
    
    // 删除节点
    nodes = nodes.filter((node) => {
      return nodes.indexOf(node) === -1;
    });
    nodes.forEach((node) => {
      promises.push(NodeAction.Delete(node.id, t));
    });
    promiseValues = await Promise.all(promises);
    for (let i = 0; i < promiseValues.length; i++) {
      if (promiseValues[i] <= 0) {
        throw new Error('删除节点失败');
      }
    }

    await t.commit();

    return new Restful(0, '更新流程成功', {
      nodes: bulkNodes.map((node) => {
        return node.toJSON();
      }),
      lines: bulkLines.map((line) => {
        return line.toJSON();
      })
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
