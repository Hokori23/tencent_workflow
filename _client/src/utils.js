/**
 * 函数防抖处理
 * @returns { Function }
 */
const debounce = (callback, delay) => {
  return (() => {
    let timer = null;
    return (...params) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(callback, delay, ...params);
    };
  })();
};

/**
 * 函数节流处理
 * @returns { Function }
 */
const throttle = (callback, delay) => {
  console.log(delay);
  return (() => {
    let timer = null;
    return (...params) => {
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          callback(...params);
        }, delay);
      } else {
        console.log('throttle');
      }
    };
  })();
};

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

export { debounce, throttle, getDistance, isDef, isUndef, dealWithResultCode };
