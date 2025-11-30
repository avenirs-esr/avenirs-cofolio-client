import CreationUpdateDateDetails from '@/common/components/CreationUpdateDateDetails/CreationUpdateDateDetails.vue'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a CreationUpdateDateDetails component', () => {
  let wrapper: ReturnType<typeof mount<typeof CreationUpdateDateDetails>>

  const stubs = {
    AvIconText: AvIconTextStub
  }

  const CREATED = '2025-01-10T09:30:00.000Z'
  const UPDATED = '2025-02-15T15:45:12.345Z'

  BddTest().when('the component is mounted with both dates', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(CreationUpdateDateDetails, {
        props: {
          createdAt: CREATED,
          updatedAt: UPDATED
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render two AvIconText components', () => {
      const items = wrapper.findAllComponents({ name: 'AvIconText' })
      expect(items).toHaveLength(2)
    })

    BddTest().then('it should render createdAt with correct icon and text', () => {
      const items = wrapper.findAllComponents({ name: 'AvIconText' })
      expect(items[0].props('icon')).toBe(RI_ICONS.LOADER_LINE)
      expect(items[0].props('text')).toContain('Créé le')
      expect(items[0].props('text')).toContain('10 janvier 2025')
      expect(items[0].props('textColor')).toBe('var(--text2)')
      expect(items[0].props('iconColor')).toBe('var(--text2)')
    })

    BddTest().then('it should render updatedAt with correct icon and text', () => {
      const items = wrapper.findAllComponents({ name: 'AvIconText' })
      expect(items[1].props('icon')).toBe(MDI_ICONS.PENCIL_OUTLINE)
      expect(items[1].props('text')).toContain('Modifié le')
      expect(items[1].props('text')).toContain('15 février 2025')
      expect(items[1].props('textColor')).toBe('var(--text2)')
      expect(items[1].props('iconColor')).toBe('var(--text2)')
    })
  })

  BddTest().when('the component is mounted with createdAtPrefix', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(CreationUpdateDateDetails, {
        props: {
          createdAt: CREATED,
          updatedAt: UPDATED,
          createdAtPrefix: 'Compétence'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render createdAt with prefix in text', () => {
      const items = wrapper.findAllComponents({ name: 'AvIconText' })
      expect(items[0].props('text')).toContain('Compétence créé le')
      expect(items[0].props('text')).toContain('10 janvier 2025')
    })
  })

  BddTest().when('the component is mounted with only createdAt', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(CreationUpdateDateDetails, {
        props: {
          createdAt: CREATED
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render only one AvIconText component', () => {
      const items = wrapper.findAllComponents({ name: 'AvIconText' })
      expect(items).toHaveLength(1)
    })

    BddTest().then('it should render createdAt with formatted date', () => {
      const items = wrapper.findAllComponents({ name: 'AvIconText' })
      expect(items[0].props('icon')).toBe(RI_ICONS.LOADER_LINE)
      expect(items[0].props('text')).toContain('Créé le')
      expect(items[0].props('text')).toContain('10 janvier 2025')
    })
  })

  BddTest().when('the component is mounted with only updatedAt', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(CreationUpdateDateDetails, {
        props: {
          updatedAt: UPDATED
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render only one AvIconText component', () => {
      const items = wrapper.findAllComponents({ name: 'AvIconText' })
      expect(items).toHaveLength(1)
    })

    BddTest().then('it should render updatedAt with formatted date', () => {
      const items = wrapper.findAllComponents({ name: 'AvIconText' })
      expect(items[0].props('icon')).toBe(MDI_ICONS.PENCIL_OUTLINE)
      expect(items[0].props('text')).toContain('Modifié le')
      expect(items[0].props('text')).toContain('15 février 2025')
    })
  })

  BddTest().when('the component is mounted without any dates', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(CreationUpdateDateDetails, {
        global: { stubs }
      })
    })

    BddTest().then('it should not render any AvIconText components', () => {
      const items = wrapper.findAllComponents({ name: 'AvIconText' })
      expect(items).toHaveLength(0)
    })
  })
})
