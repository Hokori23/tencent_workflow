/**
 * 计算两点距离
 */
const getDistance = (x1, y1, x2, y2) => {
  return ~~Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

const isDef = v => {
  return v !== undefined && v !== null;
};

const isUndef = v => {
  return v === undefined || v === null;
};

/**
 * 调用接口结果弹窗处理
 */
const dealWithResultCode = (code, message, vm) => {
  if (code) {
    vm.$alert(message, '警告', {
      confirmButtonText: '确定',
      type: 'error'
    });
  } else {
    vm.$message({
      message,
      type: 'success',
      duration: 1000
    });
  }
};

export { getDistance, isDef, isUndef, dealWithResultCode };
