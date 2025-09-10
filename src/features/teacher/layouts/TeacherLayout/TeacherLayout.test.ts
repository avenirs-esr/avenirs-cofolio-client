import type { VueWrapper } from '@vue/test-utils'
import TeacherLayout from '@/features/teacher/layouts/TeacherLayout/TeacherLayout.vue'
import { teacherHomeRoute } from '@/features/teacher/routes'
import { mountWithRouter } from '@/ui/tests/utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a teacher layout component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TeacherLayout>>

  const stubs = {
    AvHeader: {
      name: 'AvHeader',
      props: ['modelValue', 'serviceTitle', 'homeTo', 'quickLinks', 'languageSelector'],
      emits: ['update:modelValue', 'language-select'],
      template: `
      <div>
        <button @click="quickLinks[0].onClick($event)" data-testid="home-btn">Home</button>
      </div>
    `
    }
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    wrapper = await mountWithRouter<typeof TeacherLayout>(TeacherLayout, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the AvHeader component', () => {
      expect(wrapper.findComponent({ name: 'AvHeader' }).exists()).toBe(true)
    })

    BddTest().then('it should pass correct quickLinks to AvHeader', () => {
      const header = wrapper.findComponent({ name: 'AvHeader' })
      const quickLinks = header.props('quickLinks')

      expect(quickLinks).toEqual([
        {
          label: 'Home',
          to: teacherHomeRoute,
          icon: 'ri-home-4-line',
          iconAttrs: { color: 'var(--red-marianne-425-625)' },
        },
      ])
    })
  })

  BddTest().when('AvHeader emits update:modelValue', () => {
    BddTest().then('it should update the searchQuery property', async () => {
      const avHeader = wrapper.findComponent({ name: 'AvHeader' })
      avHeader.vm.$emit('update:modelValue', 'test')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.searchQuery).toBe('test')
    })
  })

  BddTest().when('searchQuery is updated', () => {
    BddTest().then('it should pass searchQuery as modelValue to AvHeader', async () => {
      const avHeader = wrapper.findComponent({ name: 'AvHeader' })
      wrapper.vm.searchQuery = 'test'
      await wrapper.vm.$nextTick()

      expect(avHeader.props('modelValue')).toBe('test')
    })
  })
})
