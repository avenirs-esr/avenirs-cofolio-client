import type { ActivityResourceFile, ActivityResourceLink } from '@/features/staff/activities/types/resource.types'
import type { VueWrapper } from '@vue/test-utils'
import ActivityResourceCard from '@/features/staff/activities/components/cards/ActivityResourceCard/ActivityResourceCard.vue'
import { ActivityResourceType } from '@/features/staff/activities/types/resource.types'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvCardStub, AvIconStub, AvTagStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()

  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage,
    }),
  }
})

BddTest().given('an activity resource card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityResourceCard>>

  const stubs = {
    AvCard: AvCardStub,
    AvIcon: AvIconStub,
    AvTag: AvTagStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with a file resource', () => {
    const resource: ActivityResourceFile = {
      title: 'resource.pdf',
      type: ActivityResourceType.FILE,
      fileId: 'file-id',
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityResourceCard, {
        props: { resource },
        global: { stubs },
      })
    })

    BddTest().then('it should render the card', () => {
      expect(wrapper.find('[data-testid="activity-resource-card"]').exists()).toBe(true)
    })

    BddTest().then('it should render the file icon', () => {
      const activityIcon = wrapper.findComponent(AvIconStub)

      expect(activityIcon.exists()).toBe(true)
      expect(activityIcon.props('name')).toBe(MDI_ICONS.FILE)
    })

    BddTest().then('it should render the title', () => {
      expect(wrapper.find('[data-testid="activity-resource-card-title"]').text()).toBe(resource.title)
    })

    BddTest().then('it should render the file type tag', () => {
      const tag = wrapper.findComponent(AvTagStub)

      expect(tag.exists()).toBe(true)
      expect(tag.props('label')).toBe('fichier')
    })

    BddTest().then('it should not render an anchor', () => {
      expect(wrapper.find('a').exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with a link resource', () => {
    const resource: ActivityResourceLink = {
      title: 'Documentation',
      type: ActivityResourceType.LINK,
      url: 'https://avenir-esr.fr',
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityResourceCard, {
        props: { resource },
        global: { stubs },
      })
    })

    BddTest().then('it should render the card', () => {
      expect(wrapper.find('[data-testid="activity-resource-card"]').exists()).toBe(true)
    })

    BddTest().then('it should render the link icon', () => {
      const activityIcon = wrapper.findComponent(AvIconStub)

      expect(activityIcon.exists()).toBe(true)
      expect(activityIcon.props('name')).toBe(MDI_ICONS.LINK)
    })

    BddTest().then('it should render the title', () => {
      expect(wrapper.find('[data-testid="activity-resource-card-title"]').text()).toBe(resource.title)
    })

    BddTest().then('it should render the link type tag', () => {
      const tag = wrapper.findComponent(AvTagStub)

      expect(tag.exists()).toBe(true)
      expect(tag.props('label')).toBe('lien')
    })

    BddTest().then('it should render an anchor', () => {
      const anchor = wrapper.find('a')

      expect(anchor.exists()).toBe(true)
      expect(anchor.attributes('href')).toBe(resource.url)
      expect(anchor.attributes('target')).toBe('_blank')
      expect(anchor.attributes('rel')).toBe('noopener noreferrer')
    })
  })
})
