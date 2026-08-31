export const DeclaredSkillMacroSkillBadgeStub = defineComponent({
  name: 'DeclaredSkillMacroSkillBadge',
  props: ['pathSegments'],
  template: '<div class="declared-skill-macro-skill-badge-stub">{{ pathSegments.join(\' > \') }}</div>'
})
