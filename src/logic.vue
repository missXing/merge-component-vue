<template>
  <div class="tree-rule-logic">
    <byted-select
      v-model="value.operator"
      class="logic-left"
      filled
      :disabled="disabled"
    >
      <byted-option
        v-for="item in LogicOperatorEnum"
        :key="item.code"
        :value="item.code"
      >
        {{ item.name }}
      </byted-option>
    </byted-select>
    <div class="logic-right" :class="{'hide-button': !showAddButton}">
      <slot />
      <div v-if="showAddButton" class="add-button">
        <slot name="add" :mutator="mutator" />
      </div>
    </div>
  </div>
</template>
<script>
import { LogicOperatorEnum } from './types';
export default {
  name: 'Logic',
  components: {},
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      LogicOperatorEnum,
      tt: 'And',
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
    mutator() {
      return this.__baseNode__.mutator;
    },
    showAddButton() {
      return this.__baseNode__.showAddButton && !this.disabled;
    },
    disabled() {
      return this.__baseRule__.disabled;
    },
  },
  created() {
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
// .crow-disabled {
//   /deep/ .bui-icon-angle-down {
//     display: none;
//   }
//   /deep/ .bui-input {
//     color: @gray-11 !important;
//   }
// }
.tree-rule-logic {
  position: relative;
  align-items: center;
  display: flex;
  margin-bottom: 26px;
  .logic-left {
    width: 64px;
    margin-right: 32px;
    position: relative;
    align-items: center;
    display: flex;
    &::after {
      position: absolute;
      top: 50%;
      left: -16px;
      width: 16px;
      height: 2px;
      background-color: #EAF1FA;
      content: "";
    }
    &::before {
      position: absolute;
      top: 50%;
      right: -16px;
      width: 16px;
      height: 2px;
      background-color: #EAF1FA;
      content: "";
    }
  }
  .logic-right {
    .add-button {
      position: relative;
       &::before {
        position: absolute;
        top: calc(50% + 2px);
        left: -16px;
        width: 16px;
        height: 2px;
        background-color: #EAF1FA;
        content: "";
      }
    }
    .tree-rule-node-wrap {
      position: relative;
      &::after {
        position: absolute;
        top: 0px;
        bottom: 0;
        left: -16px;
        width: 2px;
        height: calc(100% + 16px);
        background-color: #EAF1FA;
        content: "";
      }
    }
    .tree-rule-node-wrap:first-child::after {
      position: absolute;
      top: calc(50% - 13px);
      bottom: 0;
      left: -16px;
      width: 2px;
      height: calc(50% + 29px);
      background-color: #EAF1FA;
      content: "";
    }
  }
  .hide-button {
    position: relative;
    .tree-rule-node-wrap:last-child::after {
      position: absolute;
      bottom: 0;
      left: -16px;
      width: 2px;
      height: calc(50% - 11px);
      background-color: #EAF1FA;
      content: "";
    }
    .tree-rule-field:last-child {
      &::after {
        content: none;
      }
      /deep/ .node {
        margin-bottom: 0px;
      }
    }
  }
}
</style>
