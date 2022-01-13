<template>
  <div class="tree-rule-node-wrap">
    <div class="tree-rule-node">
      <logic :value="value">
        <template v-for="item of value.filters">
          <tree-node v-if="item.operator && item.filters" :key="item[keyName]" :value="item" :currentDepth="nextDepth">
            <template v-slot:data="{data}">
              <slot name="data" :data="data" />
            </template>
            <template v-slot:add="{mutator}">
              <slot name="add" :mutator="mutator" />
            </template>
          </tree-node>
          <field
            v-else
            :key="item[keyName]"
            :value="item"
          >
            <template v-slot:data="{data}">
              <slot name="data" :data="data" />
            </template>
          </field>
        </template>
        <template v-slot:add="{mutator}">
          <slot name="add" :mutator="mutator" />
        </template>
      </logic>
    </div>
  </div>
</template>

<script>
import { Mutator } from './mutator';
import Field from './field.vue';
import Logic from './logic.vue';
import { keyName, dispatch } from './utils';
import { createValue, isLogicNode } from './utils';
import { Types } from './types';
export default {
  name: 'TreeNode',
  components: { Field, Logic },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    currentDepth: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      mutator: new Mutator(),
      keyName,
      isLogicNode,
    };
  },
  provide() {
    return {
      __baseNode__: this,
    };
  },
  inject: {
    __baseRule__: {
      default: null,
    },
  },
  computed: {
    nextDepth() {
      return this.currentDepth + 1;
    },
    showAddButton() {
      return this.value.filters.length < this.__baseRule__.nodeLimit;
    },
  },
  created() {
    this.mutator.on('push').subscribe((nodeValue) => {
      if (!this.showAddButton) return;
      const depth = this.__baseRule__.depth - this.currentDepth;
      const valueNode = createValue({ depth, withKey: true, value: nodeValue });
      dispatch(this.value, {
        type: Types.Add,
        payload: {
          key: this.value[keyName],
          value: valueNode,
        } });
    });
  },
  mounted() {},
  methods: {
  },
};
</script>
<style lang="less" scoped>
.tree-rule-node {
  display: flex;
  position: relative;
}
</style>
