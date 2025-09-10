export const StudentEducationSkillsFiltersContainerStub = defineComponent({
  name: 'StudentEducationSkillsFiltersContainer',
  template: `<div class="student-education-skills-filters-container"/>`,
  props: ['sort'],
  emits: ['update:sort']
})
