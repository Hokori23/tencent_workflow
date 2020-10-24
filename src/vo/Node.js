export default class Node {
  /**
   *
   * @param { number } id
   * @param { string } name
   * @param { Point } position
   * @param { Array<Line> } lines
   * @param { number } type
   */
  constructor(id, name, position, lines, type) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.lines = lines;
    this.type = type; // 1. 开始节点; 2. 普通节点; 3. 结束节点
  }
}
