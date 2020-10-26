/**
 * 判断变量是否已定义
 * @param { object } v
 */
const isDef = (v: any): boolean => {
  return v !== undefined && v !== null;
};

/**
 * 判断变量是否未定义
 * @param { object } v
 */
const isUndef = (v: any): boolean => {
  return v === undefined || v === null;
};

/**
 * 属性转数组
 * @param { Object } obj
 */
const toArray = (obj: Object): Array<any> => {
  const res = [] as Array<any>;
  Object.keys(obj).forEach((key) => {
    res.push(obj[key]);
  });
  return res;
};

/**
 * 检查参数完整性
 * @param { Object } obj
 * @param { Array<string> } params
 */
const checkIntegrity = (obj: Object, params?: Array<string>): boolean => {
  return params
    ? params.every((v) => {
        return isDef(obj[v]);
      })
    : toArray(obj).every((v) => {
        return isDef(v);
      });
};

/**
 * Restful API类声明
 */
interface Restful {
  code: number;
  message: string;
  data?: any;
}
class Restful {
  code: number;
  message: string;
  data?: any;
  constructor(code: number, message: string, data: any = null) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
  static initWithError(e: any) {
    return new Restful(e.errno, e.message);
  }
}

export { isDef, isUndef, toArray, checkIntegrity, Restful };
export default {
  isDef,
  isUndef,
  toArray,
  checkIntegrity,
  Restful
};
