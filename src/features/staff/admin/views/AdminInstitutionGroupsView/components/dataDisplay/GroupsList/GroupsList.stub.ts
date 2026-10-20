export const GroupsListStub = defineComponent({
  name: 'GroupsListStub',
  props: {
    keyword: {
      type: String,
      required: false,
    },
  },
  template: '<div data-testid="group-list-stub"></div>',
})
