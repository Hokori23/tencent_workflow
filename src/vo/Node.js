import Point from './Point';
import Line from './Line';
export default class Node {
  constructor(name, position, lines, type) {
    this.name = name;
    this.position = position;
    this.lines = lines;
    this.type = type; // 1. 开始节点; 2. 普通节点; 3. 结束节点
  }
}
