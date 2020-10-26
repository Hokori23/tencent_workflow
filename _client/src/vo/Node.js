export default class Node {
  /**
   * @param { number } id
   * @param { number } flow_id
   * @param { string } name
   * @param { Point } position
   * @param { Array<Line> } lines
   * @param { number } type
   */
  constructor(id, flow_id, name, position, lines, type) {
    this.id = id;
    this.flow_id = flow_id;
    this.name = name;
    this.position = position;
    this.lines = lines;
    this.type = type; // 1. 开始节点; 2. 普通节点; 3. 结束节点
  }
}
