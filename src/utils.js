
import { v1 as uuid } from 'uuid';
import _ from 'lodash';
import { LogicOperatorNode, Types } from './types';

export const keyName = Symbol('RuleFiled');

// 创建数据
export const createValue = ({ depth, withKey, value = {} }) => {
  if (depth < 1) {
    return _.assign(withKey ? { [keyName]: uuid() } : {}, value);
  }
  const root = initRootValue();
  let child = root;
  while (--depth) {
    child.filters.push(initRootValue());
    child = child.filters[0];
  }
  child.filters.push(_.assign(withKey ? { [keyName]: uuid() } : {}, value));
  return root;
};

export const initRootValue = (withKey = true) => {
  return _.assign(
    withKey ? { [keyName]: uuid() } : {},
    {
      operator: LogicOperatorNode.And,
      filters: [],
    }
  );
};

// 是否是关系节点
export const isLogicNode = (node) => node === LogicOperatorNode.And || node === LogicOperatorNode.Or;

// 统计几点个数
export const traverse = (node, { enter }) => {
  function innerTrverse(innerNode, parent, info) {
    enter && enter(innerNode, parent, info);
    // @ts-ignore ignore the type error
    if ('filters' in innerNode) {
      const len = innerNode.filters.length;
      for (let i = len - 1; i >= 0; i--) {
        innerTrverse(innerNode.filters[i], innerNode, { index: i });
      }
    }
  }
  innerTrverse(node, null, {});
};

// 删除节点
export const remove = (node, key, parentNode, index) => {
  if (node[keyName] === key) {
    parentNode.filters.splice(index, 1);
    return;
  }

  if (node.filters && node.filters.length) {
    const len = node.filters.length;
    for (let i = len - 1; i > -1; i --) {
      remove(node.filters[i], key, node, i);
      if (node.filters.length === 0) {
        parentNode.filters.splice(index, 1);
      }
    }
  }
};

// 复制节点
export const copy = (node, key, value) => {
  const len = node.filters.length;
  for (let i = 0; i < len; i ++) {
    if (node.filters[i][keyName] === key) {
      node.filters.splice(i, 0, value);
      return;
    }
  }
};

// 数据变更
export const dispatch = (state, action) => {
  const { key, value } = action.payload;
  switch (action.type) {
    case Types.Add:
      state.filters.push(value);
      break;
    case Types.Copy:
      copy(state, key, value);
      break;
    case Types.Remove:
      remove(state, key);
      break;
    default:
      throw new Error(`You should register action type: ${JSON.stringify(action)} before dispatch it`);
  }
};

// 统计节点个数
export const countNodeLength = (value) => {
  let count = 0;
  traverse(value, {
    enter: (node) => {
      if (!isLogicNode(node.operator)) {
        count++;
      }
    },
  });
  return count;
};

// 生成复制的新节点
export const genKey = (obj) => Object.assign({}, obj, { [keyName]: uuid() });

// 获取数据的最大层级
export const getMaxDepth = (value) => {
  if (value === undefined) {
    return 0;
  }
  // 为了兼容业务逻辑 公共逻辑要去掉
  if (value.ruleType === 'profile') {
    return 1;
  }
  if (!Array.isArray(value.filters)) {
    return 0;
  }
  let max = 0;
  let tmp = 0;
  for (let i = 0; i < value.filters.length; i++) {
    tmp = getMaxDepth(value.filters[i]);
    if (max < tmp) {
      max = tmp;
    }
  }
  return 1 + max;
};

export const liftNode = (node, depth) => {
  const currentDepth = getMaxDepth(node);
  if (currentDepth >= depth) {
    return node;
  }
  const distinct = depth - currentDepth;
  return createValue({
    depth: distinct,
    withKey: false,
    value: node,
  });
};

export const treeMap = (node, map) => {
  function innerCloneMap(innerNode) {
    const newNode = map(innerNode);
    // @ts-ignore ignore the case
    if ('filters' in innerNode && typeof newNode === 'object') {
      (newNode).filters = (innerNode).filters.map((child) => innerCloneMap(child)).filter(Boolean);
    }
    return newNode;
  }
  return innerCloneMap(node);
};

export const addRecursiveKey = (node) =>
  treeMap(node, (innerNode) => {
    if (isLogicNode(innerNode.operator)) {
      return {
        operator: innerNode.operator,
        filters: [],
        [keyName]: uuid(),
      };
    } else {
      return _.assign({ [keyName]: uuid() }, _.cloneDeep(innerNode));
    }
  });
