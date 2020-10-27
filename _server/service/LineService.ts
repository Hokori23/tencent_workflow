import { LineAction as Action, FlowAction } from '@action';
import { Line } from '@vo';
import { Restful } from '@public';
import DB from '@database';

/**
 * 新增单条线
 */
const Create = async (line: Line): Promise<Restful> => {
  try {
    line = await Action.Create(line);
    return new Restful(0, '新增线成功', line.toJSON());
  } catch (e) {
    return new Restful(99, `新增线失败, ${e.message}`);
  }
};
/**
 * 批量新增线
 * @param { number } flow_id
 * @param { Array<Line> } bulkLines
 * @param { Transaction } t
 */
const CreateOrUpdate__Bulk = async (
  flow_id: number,
  bulkLines: Array<Line>
): Promise<Restful> => {
  const t = await DB.transaction();
  try {
    const flow = await FlowAction.Retrieve(flow_id);
    if (!flow) {
      return new Restful(1, '流程不存在');
    }
    bulkLines = await Action.CreateOrUpdate__Bulk(bulkLines, t);

    await t.commit();
    return new Restful(
      0,
      '批量新增线成功',
      bulkLines.map((Line) => {
        return Line.toJSON();
      })
    );
  } catch (e) {
    await t.rollback();
    return new Restful(99, `批量新增线失败, ${e.message}`);
  }
};

/**
 * 遍历某流程线
 * @param { number } flow_id
 */
const Retrieve__All = async (flow_id: number): Promise<Restful> => {
  try {
    const Lines = await Action.Retrieve__All(flow_id);
    return new Restful(
      0,
      '查询成功',
      Lines.map((Line) => {
        return Line?.toJSON();
      })
    );
  } catch (e) {
    return new Restful(99, `遍历线失败, ${e.message}`);
  }
};

/**
 * 删除线
 */
const Delete = async (id: number): Promise<Restful> => {
  try {
    const deleteRow = await Action.Delete(id);
    return deleteRow > 0
      ? new Restful(0, '删除线成功')
      : new Restful(1, '删除线失败');
  } catch (e) {
    return new Restful(99, `删除线失败, ${e.message}`);
  }
};

export default { Create, CreateOrUpdate__Bulk, Retrieve__All, Delete };
