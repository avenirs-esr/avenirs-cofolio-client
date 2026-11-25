import { defineComponent } from 'vue'

export const ToolTabsStub = defineComponent({
  name: 'ToolTabs',
  props: {
    localBaseRouteName: {
      type: String,
      default: undefined,
    },
    nationalBaseRouteName: {
      type: String,
      default: undefined,
    },
    regionalBaseRouteName: {
      type: String,
      default: undefined,
    },
  },
  template: '<div data-testid="tool-tabs-stub" />',
})
