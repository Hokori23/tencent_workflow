export default class Line {
  /**
   * @param { number } id
   * @param { number } flow_id
   * @param { string } text
   * @param { Node } start
   * @param { Node } end
   * @param { number } start_anchor // 1上; 2右; 3下; 4左;
   * @param { number } end_anchor // 1上; 2右; 3下; 4左;
   * @param { number } type
   * @param { string } option  // JSON对象字符串（数据库）
   */
  constructor(
    id,
    flow_id,
    text,
    start,
    end,
    start_anchor,
    end_anchor,
    type,
    option
  ) {
    this.id = id;
    this.flow_id = flow_id;
    this.text = text; // 条件文字
    this.start = start;
    this.end = end;
    this.start_anchor = start_anchor;
    this.end_anchor = end_anchor;
    /**
     * 1: 默认连线样式, 动态锚点;
     * 2: 自定义直线样式, 固定锚点;
     * 3: 贝塞尔曲线, 固定锚点;
     */
    this.type = type;
    /**
     * 自定义直线样式
     * option: {
     *    path: {
     *      stroke: string,
     *      strokeWidth: number,
     *    },
     *    point: {
     *      fill: string,
     *      stroke: string
     *    }
     * }
     */
    if (type === 2 && option) {
      this.option = JSON.parse(option);
    } else {
      this.option = {};
    }
  }
}
