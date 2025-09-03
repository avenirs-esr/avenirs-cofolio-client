import type { VueWrapper } from '@vue/test-utils'
import TeacherLayout from '@/features/teacher/layouts/TeacherLayout/TeacherLayout.vue'
import { teacherHomeRoute } from '@/features/teacher/routes'
import { mountWithRouter } from '@/ui/tests/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

describe('teacherLayout', () => {
  describe('given a teacher layout component', () => {
    let wrapper: VueWrapper<InstanceType<typeof TeacherLayout>>

    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = await mountWithRouter<typeof TeacherLayout>(TeacherLayout, {
        global: { stubs }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the AvHeader component', () => {
        expect(wrapper.findComponent({ name: 'AvHeader' }).exists()).toBe(true)
      })

      it('then it should pass correct quickLinks to AvHeader', () => {
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

    describe('when AvHeader emits update:modelValue', () => {
      it('then it should update the searchQuery property', async () => {
        const avHeader = wrapper.findComponent({ name: 'AvHeader' })
        avHeader.vm.$emit('update:modelValue', 'test')
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.searchQuery).toBe('test')
      })
    })

    describe('when searchQuery is updated', () => {
      it('then it should pass searchQuery as modelValue to AvHeader', async () => {
        const avHeader = wrapper.findComponent({ name: 'AvHeader' })
        wrapper.vm.searchQuery = 'test'
        await wrapper.vm.$nextTick()

        expect(avHeader.props('modelValue')).toBe('test')
      })
    })
  })
})
