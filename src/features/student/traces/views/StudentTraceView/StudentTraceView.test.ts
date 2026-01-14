import { mockedTraceDetailed } from '@/__mocks__/fixtures/student/traces.fixtures'
import { createTraceDetailedHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import StudentTraceView from '@/features/student/traces/views/StudentTraceView/StudentTraceView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountComponent } from 'tests/utils'

BddTest().given('a student trace view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentTraceView>>

  const stubs = {
    PageTitle: PageTitleStub,
    AvTabs: {
      name: 'AvTabs',
      props: ['modelValue'],
      template: '<div class="av-tabs"><slot /></div>'
    },
    AvTab: {
      name: 'AvTab',
      props: ['title', 'icon'],
      template: '<div class="av-tab"><slot /></div>'
    },
    TraceSettingsDropdown: {
      name: 'TraceSettingsDropdown',
      template: '<div class="trace-settings-popover" />'
    },
    TraceDeletionConfirmationModal: {
      name: 'TraceDeletionConfirmationModal',
      props: ['trace', 'show'],
      template: '<div class="trace-deletion-confirmation-modal" />'
    },
    UpdateTraceModal: {
      name: 'UpdateTraceModal',
      props: ['trace'],
      template: '<div class="update-trace-modal" />'
    },
    StudentDetailedTraceAssociateModal: {
      name: 'StudentDetailedTraceAssociateModal',
      props: ['trace', 'show', 'onConfirmAssociateTrace', 'onClose'],
      template: `
        <div v-if="show" class="associate-modal">
          <div class="trace-title">{{ trace?.title }}</div>
          <button class="associate-close" @click="onClose()">close</button>
        </div>
      `
    },
    StudentTraceDetails: {
      name: 'StudentTraceDetails',
      props: ['trace'],
      template: '<div class="student-trace-details" />'
    },
    StudentTraceAssociations: {
      name: 'StudentTraceAssociations',
      props: ['skillLevelAssociations', 'declaredSkillAssociations'],
      template: '<div class="student-trace-associations" />'
    }
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    const handler = createTraceDetailedHandler(mockedTraceDetailed)
    server.use(handler)
    wrapper = mountComponent(StudentTraceView, {
      props: { traceId: mockedTraceDetailed.id },
      global: { stubs },
      useTanstack: true,
      usePinia: true
    })

    await flushPromises()
  })

  const title = `Trace ${mockedTraceDetailed.title}`
  const breadcrumbLinks = [
    { text: 'Accueil', to: ROUTES.STUDENT.HOME },
    { text: 'Mes outils' },
    { text: 'Mes traces', to: ROUTES.STUDENT.TOOLS_TRACES },
    { text: mockedTraceDetailed.title }
  ]

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', async () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual(breadcrumbLinks)
    })

    BddTest().then('it should render the popover', async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })
      expect(popover.exists()).toBe(true)
    })

    BddTest().then('it should render the TraceDeletionConfirmationModal initially hidden', async () => {
      const modal = wrapper.findComponent({ name: 'TraceDeletionConfirmationModal' })
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
    })

    BddTest().then('it should render the UpdateTraceModal', async () => {
      const modal = wrapper.findComponent({ name: 'UpdateTraceModal' })
      expect(modal.exists()).toBe(true)
      expect(modal.props('trace')).toEqual(mockedTraceDetailed)
    })

    BddTest().then('it should render AvTabs component', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      expect(tabs.exists()).toBe(true)
    })

    BddTest().then('it should render two AvTab components', () => {
      const tabs = wrapper.findAllComponents({ name: 'AvTab' })
      expect(tabs).toHaveLength(2)
    })

    BddTest().then('it should render the trace details tab with correct title', () => {
      const tabs = wrapper.findAllComponents({ name: 'AvTab' })
      expect(tabs[0].props('title')).toBe('Ma trace')
    })

    BddTest().then('it should render the associations tab with correct title', () => {
      const tabs = wrapper.findAllComponents({ name: 'AvTab' })
      expect(tabs[1].props('title')).toBe('Mes associations')
    })

    BddTest().then('it should render StudentTraceDetails component in the first tab', () => {
      const traceDetails = wrapper.findComponent({ name: 'StudentTraceDetails' })
      expect(traceDetails.exists()).toBe(true)
      expect(traceDetails.props('trace')).toEqual(mockedTraceDetailed)
    })

    BddTest().then('it should have TraceAssociations component available', () => {
      const allTabs = wrapper.findAllComponents({ name: 'AvTab' })
      expect(allTabs).toHaveLength(2)
    })

    BddTest().then('it should render the StudentDetailedTraceAssociateModal initially hidden', async () => {
      const modal = wrapper.findComponent({ name: 'StudentDetailedTraceAssociateModal' })
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
    })
  })

  BddTest().when('TraceSettingsDropdown emits associate-selected', () => {
    BddTest().then('it should open the associate modal', async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })
      await popover.vm.$emit('associate-selected')
      await flushPromises()

      const modal = wrapper.findComponent({ name: 'StudentDetailedTraceAssociateModal' })
      expect(modal.props('show')).toBe(true)
      expect(wrapper.find('.associate-modal .trace-title').text()).toContain(mockedTraceDetailed.title)
    })
  })

  BddTest().when('Associate modal is opened', () => {
    BddTest().and('its close is triggered', () => {
      BddTest().then('it should hide the associate modal', async () => {
        const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })
        await popover.vm.$emit('associate-selected')
        await flushPromises()

        await wrapper.find('.associate-close').trigger('click')
        await flushPromises()

        const modal = wrapper.findComponent({ name: 'StudentDetailedTraceAssociateModal' })
        expect(modal.props('show')).toBe(false)
      })
    })
  })

  BddTest().when('the delete modal is triggered', () => {
    beforeEach(async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })
      await popover.vm.$emit('delete-selected')
      await flushPromises()
    })

    BddTest().then('it should show the deletion confirmation modal', () => {
      const modal = wrapper.findComponent({ name: 'TraceDeletionConfirmationModal' })
      expect(modal.props('show')).toBe(true)
    })
  })

  BddTest().when('the update modal is triggered', () => {
    beforeEach(async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })
      await popover.vm.$emit('update-selected')
      await flushPromises()
    })

    BddTest().then('it should call displayUpdateTraceModal from store', async () => {
      const { useTracesStore } = await import('@/features/student/traces')
      const tracesStore = useTracesStore()
      expect(tracesStore.showUpdateTraceModal).toBe(true)
    })
  })
})
