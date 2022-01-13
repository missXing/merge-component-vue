<template>
  <div class="tree-rule-base">
    <tree-node :value="value" :currentDepth="currentDepth">
      <template v-slot:data="{data}">
        <slot name="data" :data="data" />
      </template>
      <template v-slot:add="{mutator}">
        <slot name="add" :mutator="mutator" />
      </template>
    </tree-node>
  </div>
</template>

<script>
import TreeNode from './node.vue';
import { createValue, liftNode, addRecursiveKey } from './utils';
export default {
  name: 'Base',
  components: { TreeNode },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    depth: {
      type: Number,
      default: 2,
    },
    nodeLimit: {
      type: Number,
      default: Number.MAX_VALUE,
    },
    initialValue: {
      type: Object,
      default: () => ({}),
    },
  },
  provide() {
    return {
      __baseRule__: this,
    };
  },
  data() {
    return {
      value: {},
      currentDepth: 1,
    };
  },
  computed: {},
  watch: {
    value: {
      handler(val) {
        this.$emit('change', val);
      },
      deep: true,
    },
    initialValue: {
      handler(val) {
        this.value = Object.keys(this.initialValue).length > 0 ?
          addRecursiveKey(liftNode(this.initialValue, this.depth)) :
          createValue({ depth: this.depth, withKey: true, value: {} });
      },
      deep: true,
      immediate: true,
    },
  },
  created() {

  },
  mounted() {

  },
  methods: {
  },
};
</script>
<style lang="less" scoped>
.tree-rule-base {
  overflow: hidden;
}
</style>
