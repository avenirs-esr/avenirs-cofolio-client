import { defineComponent } from 'vue'

export const ToolTabsStub = defineComponent({
  name: 'ToolTabs',
  props: {
    baseRouteName: {
      type: String,
      default: undefined,
    },
  },
  template: '<div data-testid="tool-tabs-stub" />',
})
