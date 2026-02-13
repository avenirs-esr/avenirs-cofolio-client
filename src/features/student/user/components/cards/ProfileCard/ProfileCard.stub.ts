import type { Component } from 'vue'

export const ProfileCardStub: Component = defineComponent({
  name: 'ProfileCard',
  template: '<div data-testid="profile-card-stub"><slot/></div>',
  props: ['studentSummary']
})
