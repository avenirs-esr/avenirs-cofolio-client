export const SkillsSortContainerStub = defineComponent({
  name: 'SkillsSortContainer',
  template: `<div class="skills-sort-container"/>`,
  props: ['sort'],
  emits: ['update:sort']
})
