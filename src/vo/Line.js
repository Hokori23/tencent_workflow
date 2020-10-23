import Node from './Node';
export default class Line {
  constructor(text, start, start_anchor, end, end_anchor, type) {
    this.text = text; // 条件文字
    this.start = start;
    this.start_anchor = start_anchor;
    this.end = end;
    this.end_anchor = end_anchor;
    this.type = type; // 1: 默认连线样式, 动态锚点; 2: 自定义直线样式, 固定锚点; 3: 贝塞尔曲线, 固定锚点;
  }
}
