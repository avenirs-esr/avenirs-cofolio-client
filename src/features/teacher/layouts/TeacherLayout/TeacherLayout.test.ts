import TeacherLayout from '@/features/teacher/layouts/TeacherLayout/TeacherLayout.vue'
import { teacherHomeRoute } from '@/features/teacher/routes'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/ui', async () => {
  return {
    AvHeader: {
      name: 'AvHeader',
      props: ['modelValue', 'serviceTitle', 'homeTo', 'quickLinks', 'languageSelector'],
      emits: ['update:modelValue', 'language-select'],
      template: `
        <div>
          <button @click="quickLinks[0].onClick($event)" data-testid="home-btn">Home</button>
        </div>
      `,
    },
  }
})

describe('teacherLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render header correctly', async () => {
    const wrapper = await mountWithRouter(TeacherLayout)
    expect(wrapper.findComponent({ name: 'AvHeader' }).exists()).toBe(true)
  })

  it('should update searchQuery when AvHeader emits update:modelValue', async () => {
    const wrapper = await mountWithRouter<typeof TeacherLayout>(TeacherLayout)
    const avHeader = wrapper.findComponent({ name: 'AvHeader' })
    avHeader.vm.$emit('update:modelValue', 'test')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.searchQuery).toBe('test')
  })

  it('should pass searchQuery as modelValue to AvHeader', async () => {
    const wrapper = await mountWithRouter<typeof TeacherLayout>(TeacherLayout)
    const avHeader = wrapper.findComponent({ name: 'AvHeader' })
    wrapper.vm.searchQuery = 'test'
    await wrapper.vm.$nextTick()

    expect(avHeader.props('modelValue')).toBe('test')
  })

  it('should pass correct quickLinks to AvHeader', async () => {
    const wrapper = await mountWithRouter(TeacherLayout)
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
