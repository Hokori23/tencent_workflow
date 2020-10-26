import axios from 'axios';

axios.defaults.baseURL = '/api';
/**
 * 创建流程
 * @param { Object } payload
 * { text: string }
 */
const createFlow = payload => {
  return new Promise((resolve, reject) => {
    axios
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
    axios
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
    axios
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
    axios
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
    axios
      .post('/delete', { id })
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};
export { createFlow, updateFlow, getFlow, getAllFlows, deleteFlow };
