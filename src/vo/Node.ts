import Point from './Point';
import Line from './Line';
export default class Node {
  public name!: string;
  public position!: Point;
  public lines!: Array<Line>;
  public type!: number; // 1. 开始节点; 2. 普通节点; 3. 结束节点
}