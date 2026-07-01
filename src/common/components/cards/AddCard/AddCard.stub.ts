import type { Component } from 'vue'

export const AddCardStub: Component = defineComponent({
  name: 'AddCard',
  props: ['label'],
  emits: ['click'],
  template: '<div data-testid="add-card-stub"></div>',
})
