import Node from './Node';
export default class Line {
  public text!: string; // 条件文字
  public start!: Node;
  public start_anchor!: number;
  public end!: Node;
  public end_anchor!: number;
  public type!: number; // 1: 默认连线样式, 动态锚点; 2: 自定义直线样式, 固定锚点; 3: 贝塞尔曲线, 固定锚点;
}
