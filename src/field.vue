<template>
  <div class="tree-rule-field">
    <div :key="value[keyName]" class="node">
      <slot name="data" :data="data" />
    </div>
  </div>
</template>
<script>
import { keyName, dispatch, countNodeLength, genKey } from './utils';
import { Types } from './types';
import { Mutator } from './mutator';
export default {
  name: 'Field',
  components: {},
  props: {
    value: {
      type: Object,
      default:() => ({}),
    },
  },
  data() {
    return {
      mutator: new Mutator(),
      keyName,
    };
  },
  inject: {
    __baseNode__: {
      default: null,
    },
    __baseRule__: {
      default: null,
    },
  },
  computed: {
    data() {
      return {
        value: this.value,
        mutator: this.mutator,
        nodeCount: countNodeLength(this.__baseRule__.value),
        canAdd: this.__baseNode__.showAddButton,
      };
    },
  },
  created() {
    this.mutator.on('remove').subscribe(() => {
      dispatch(this.__baseRule__.value, { type: Types.Remove, payload: { key: this.value[keyName] } });
    });
    this.mutator.on('copy').subscribe(() => {
      if (!this.__baseNode__.showAddButton) return;
      const valueNode = genKey(this.value);
      dispatch(this.__baseNode__.value, { type: Types.Copy, payload: { key: this.value[keyName], value: valueNode } });
    });
  },
  mounted() {},
  methods: {
  },
};
</script>
<style lang="less" scoped>
.tree-rule-field {
  position: relative;
  display: flex;
  flex-direction: column;
  &::after {
    position: absolute;
    top: 17px;
    bottom: 0;
    left: -16px;
    width: 2px;
    height: 100%;
    background-color: #EAF1FA;
    content: "";
  }
  .node {
    margin-bottom: 16px;
    &::before {
      position: absolute;
      top: 17px;
      left: -16px;
      width: 16px;
      height: 2px;
      background-color: #EAF1FA;
      content: "";
    }
  }
}
</style>
