import type { VueWrapper } from '@vue/test-utils'
import { FooterStub } from '@/common/components/Footer/Footer.stub'
import { ROUTES } from '@/common/constants'
import StaffLayout from '@/features/staff/global/layouts/StaffLayout/StaffLayout.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const AvHeaderStub = defineComponent({
  name: 'AvHeader',
  props: ['modelValue', 'serviceTitle', 'homeTo', 'quickLinks', 'languageSelector'],
  emits: ['update:modelValue', 'language-select'],
  template: `
    <div>
      <button @click="quickLinks[0].onClick($event)" data-testid="home-btn">Home</button>
    </div>
  `
})

BddTest().given('a staff layout component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffLayout>>

  const stubs = {
    AvHeader: AvHeaderStub,
    Footer: FooterStub
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    wrapper = await mountWithRouter<typeof StaffLayout>(StaffLayout, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the AvHeader component', () => {
      expect(wrapper.findComponent(AvHeaderStub).exists()).toBe(true)
    })

    BddTest().then('it should render the Footer component', () => {
      expect(wrapper.findComponent(FooterStub).exists()).toBe(true)
    })

    BddTest().then('it should pass correct quickLinks to AvHeader', () => {
      const header = wrapper.findComponent(AvHeaderStub)
      const quickLinks = header.props('quickLinks')

      expect(quickLinks).toEqual([
        {
          label: 'Home',
          to: ROUTES.STAFF.HOME,
          icon: 'ri-home-4-line',
          iconAttrs: { color: 'var(--red-marianne-425-625)' },
        },
      ])
    })

    BddTest().and('AvHeader emits update:modelValue', () => {
      beforeEach(async () => {
        const avHeader = wrapper.findComponent(AvHeaderStub)
        avHeader.vm.$emit('update:modelValue', 'test')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the searchQuery property', () => {
        expect(wrapper.vm.searchQuery).toBe('test')
      })
    })

    BddTest().and('searchQuery is updated', () => {
      let avHeader: VueWrapper<InstanceType<typeof AvHeaderStub>>

      beforeEach(async () => {
        avHeader = wrapper.findComponent(AvHeaderStub)
        wrapper.vm.searchQuery = 'test'
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should pass searchQuery as modelValue to AvHeader', async () => {
        expect(avHeader.props('modelValue')).toBe('test')
      })
    })
  })
})
