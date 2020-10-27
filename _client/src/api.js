import axios from 'axios';

axios.defaults.baseURL = '/api';
const flowAPI = axios.create({
  baseURL: '/flow'
});
const nodeAPI = axios.create({
  baseURL: '/node'
});
const lineAPI = axios.create({
  baseURL: '/line'
});

/**
 * 创建节点
 * @param { Node } payload
 */
const createNode = payload => {
  return new Promise((resolve, reject) => {
    nodeAPI
      .post('/create', payload)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

/**
 * 删除节点
 * @param { number } id
 */
const deleteNode = id => {
  return new Promise((resolve, reject) => {
    nodeAPI
      .post('/delete', { id })
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

/**
 * 创建连线
 * @param { Line } payload
 */
const createLine = payload => {
  return new Promise((resolve, reject) => {
    lineAPI
      .post('/create', payload)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

/**
 * 删除连线
 * @param { number } id
 */
const deleteLine = id => {
  return new Promise((resolve, reject) => {
    lineAPI
      .post('/delete', { id })
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

/**
 * 创建流程
 * @param { Object } payload
 * { text: string }
 */
const createFlow = payload => {
  return new Promise((resolve, reject) => {
    flowAPI
      .post('/create', payload)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

/**
 * 更新流程
 * @param { Object } payload
 * { id: number, nodes: Array<Node>, lines: Array<Line>}
 */
const updateFlow = payload => {
  return new Promise((resolve, reject) => {
    flowAPI
      .post('/update', payload)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

/**
 * 获取该流程所有节点和线
 * @param { number } id
 */
const getFlow = id => {
  return new Promise((resolve, reject) => {
    flowAPI
      .get('/get', {
        params: {
          id
        }
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

/**
 * 获取所有流程的简要信息
 */
const getAllFlows = () => {
  return new Promise((resolve, reject) => {
    flowAPI
      .get('/get-all')
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

/**
 * 删除流程
 */
const deleteFlow = id => {
  return new Promise((resolve, reject) => {
    flowAPI
      .post('/delete', { id })
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};
export {
  createNode,
  deleteNode,
  createLine,
  deleteLine,
  createFlow,
  updateFlow,
  getFlow,
  getAllFlows,
  deleteFlow
};
