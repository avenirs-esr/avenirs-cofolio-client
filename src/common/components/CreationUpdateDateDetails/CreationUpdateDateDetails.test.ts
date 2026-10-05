import CreationUpdateDateDetails, { type CreationUpdateDateDetailsProps } from '@/common/components/CreationUpdateDateDetails/CreationUpdateDateDetails.vue'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const CREATED_AT_LABEL_FEMININE = 'Créée le'
const UPDATED_AT_LABEL_FEMININE = 'Modifiée le'
const CREATED_AT_LABEL_MASCULINE = 'Créé le'
const UPDATED_AT_LABEL_MASCULINE = 'Modifié le'

const defaultProps: CreationUpdateDateDetailsProps = {
  createdAt: '2025-01-10T09:30:00.000Z',
  updatedAt: '2025-02-15T15:45:12.345Z'
}

const defaultFormattedCreatedAt = '10 janvier 2025'
const defaultFormattedUpdatedAt = '15 février 2025'

BddTest().given('a CreationUpdateDateDetails component', () => {
  let wrapper: VueWrapper<InstanceType<typeof CreationUpdateDateDetails>>

  const stubs = {
    AvIconText: AvIconTextStub
  }

  const mountWith = (props: Partial<CreationUpdateDateDetailsProps> = {}) => {
    vi.clearAllMocks()
    wrapper = mount(CreationUpdateDateDetails, {
      props: {
        ...defaultProps,
        ...props
      },
      global: { stubs }
    })
  }

  const getAvIconTextItems = () => wrapper.findAllComponents(AvIconTextStub)

  const getItem = (testid: string) => wrapper.findComponent(`[data-testid="${testid}"]`) as VueWrapper<InstanceType<typeof AvIconTextStub>>
  const getCreatedItem = () => getItem('creation-update-date-details-created-at')
  const getUpdatedItem = () => getItem('creation-update-date-details-updated-at')

  BddTest().when('the component is mounted with both dates', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render two AvIconText components', () => {
      expect(getAvIconTextItems()).toHaveLength(2)
    })

    BddTest().then('it should render createdAt with correct icon and text', () => {
      const createdItem = getCreatedItem()
      expect(createdItem.props('icon')).toBe(RI_ICONS.LOADER_LINE)
      expect(createdItem.props('text')).toContain(CREATED_AT_LABEL_MASCULINE)
      expect(createdItem.props('text')).toContain(defaultFormattedCreatedAt)
      expect(createdItem.props('textColor')).toBe('var(--text2)')
      expect(createdItem.props('iconColor')).toBe('var(--text2)')
    })

    BddTest().then('it should render updatedAt with correct icon and text', () => {
      const updatedItem = getUpdatedItem()
      expect(updatedItem.props('icon')).toBe(MDI_ICONS.PENCIL_OUTLINE)
      expect(updatedItem.props('text')).toContain(UPDATED_AT_LABEL_MASCULINE)
      expect(updatedItem.props('text')).toContain(defaultFormattedUpdatedAt)
      expect(updatedItem.props('textColor')).toBe('var(--text2)')
      expect(updatedItem.props('iconColor')).toBe('var(--text2)')
    })
  })

  BddTest().when('the component is mounted with only createdAt', () => {
    beforeEach(() => {
      mountWith({ updatedAt: undefined })
    })

    BddTest().then('it should render only one AvIconText component', () => {
      expect(getAvIconTextItems()).toHaveLength(1)
    })

    BddTest().then('it should render createdAt with formatted date', () => {
      const createdItem = getCreatedItem()
      expect(createdItem.props('icon')).toBe(RI_ICONS.LOADER_LINE)
      expect(createdItem.props('text')).toContain(CREATED_AT_LABEL_MASCULINE)
      expect(createdItem.props('text')).toContain(defaultFormattedCreatedAt)
    })
  })

  BddTest().when('the component is mounted with only updatedAt', () => {
    beforeEach(() => {
      mountWith({ createdAt: undefined })
    })

    BddTest().then('it should render only one AvIconText component', () => {
      expect(getAvIconTextItems()).toHaveLength(1)
    })

    BddTest().then('it should render updatedAt with formatted date', () => {
      const updatedItem = getUpdatedItem()
      expect(updatedItem.props('icon')).toBe(MDI_ICONS.PENCIL_OUTLINE)
      expect(updatedItem.props('text')).toContain(UPDATED_AT_LABEL_MASCULINE)
      expect(updatedItem.props('text')).toContain(defaultFormattedUpdatedAt)
    })
  })

  BddTest().when('the component is mounted without any dates', () => {
    beforeEach(() => {
      mountWith({ createdAt: undefined, updatedAt: undefined })
    })

    BddTest().then('it should not render any AvIconText components', () => {
      expect(getAvIconTextItems()).toHaveLength(0)
    })
  })

  BddTest().when('the component is mounted with hasFeminineLabel set to true', () => {
    beforeEach(() => {
      mountWith({ hasFeminineLabel: true })
    })

    BddTest().then('it should render createdAt and updatedAt with feminine labels', () => {
      const createdItem = getCreatedItem()
      const updatedItem = getUpdatedItem()

      if (createdItem.exists()) {
        expect(createdItem.props('text')).toContain(CREATED_AT_LABEL_FEMININE)
      }

      if (updatedItem.exists()) {
        expect(updatedItem.props('text')).toContain(UPDATED_AT_LABEL_FEMININE)
      }
    })
  })
})
