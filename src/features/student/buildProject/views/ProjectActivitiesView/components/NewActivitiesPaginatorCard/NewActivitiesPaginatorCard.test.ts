import NewActivitiesPaginatorCard from '@/features/student/buildProject/views/ProjectActivitiesView/components/NewActivitiesPaginatorCard/NewActivitiesPaginatorCard.vue'
import { AvCardStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const AvPaginationStub = defineComponent({
  name: 'AvPagination',
  props: ['id', 'currentPage', 'pages', 'ariaLabel', 'compact', 'truncLimit'],
  emits: ['update:current-page'],
  template: `<button class="av-pagination" @click="$emit('update:current-page', 2)">Page 2</button>`
})

BddTest().given('a new activities paginator card', () => {
  let wrapper: VueWrapper<InstanceType<typeof NewActivitiesPaginatorCard>>

  const stubs = {
    AvCard: AvCardStub,
    AvIconText: AvIconTextStub,
    AvPagination: AvPaginationStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(NewActivitiesPaginatorCard, { global: { stubs } })
    })

    BddTest().then('it should render an AvCard component', () => {
      expect(wrapper.findComponent(AvCardStub).exists()).toBe(true)
    })

    BddTest().then('it should render the title', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toContain('Les nouveautés')
    })

    BddTest().then('it should render the pagination', () => {
      expect(wrapper.findComponent(AvPaginationStub).exists()).toBe(true)
    })
  })
})
