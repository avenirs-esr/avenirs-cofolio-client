import type { AssociationsDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import type { ManageAssociationModalProps } from '@/features/student/associations/components/overlays/modals/ManageAssociationModal/ManageAssociationModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ConfirmationModalStub, ICONS, QuerySuspenseStub } from '@avenirs-esr/shared'
import { EAssociationContextType, getUnassociateUrl } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { createMockedDeclaredSkillAssociations, createMockedTraceAssociations, mockedEmptyAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import { createAssociateHandler, createGetAssociationLimitsHandler, createGetAssociationsHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { AssociationCompactCardStub } from '@/features/student/associations/components/cards/AssociationCompactCard/AssociationCompactCard.stub'
import { AssociationContextTypeSelectStub } from '@/features/student/associations/components/interactions/AssociationContextTypeSelect/AssociationContextTypeSelect.stub'
import { AssociationSearchFilterSelectStub } from '@/features/student/associations/components/interactions/AssociationSearchFilterSelect/AssociationSearchFilterSelect.stub'
import { AssociationsSelectorStub } from '@/features/student/associations/components/interactions/AssociationsSelector/AssociationsSelector.stub'
import { SearchAssociationLayoutStub } from '@/features/student/associations/components/interactions/SearchAssociationLayout/SearchAssociationLayout.stub'
import { ConfirmManageAssociationModalStub } from '@/features/student/associations/components/overlays/modals/ConfirmManageAssociationModal/ConfirmManageAssociationModal.stub'
import ManageAssociationModal from '@/features/student/associations/components/overlays/modals/ManageAssociationModal/ManageAssociationModal.vue'
import { DEFAULT_ASSOCIATION_SEARCH_FILTER } from '@/features/student/associations/constants/associations.constants'
import { AssociationSearchFilter } from '@/features/student/associations/types/associations.types'

BddTest().given('a manage association modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof ManageAssociationModal>>
  const traces = createMockedTraceAssociations(1)
  const skills = createMockedDeclaredSkillAssociations(1)
  const associations: AssociationsDTO = {
    ...mockedEmptyAssociations,
    traceAssociations: traces,
    skillProgressAssociations: skills
  }
  const props: ManageAssociationModalProps = {
    opened: true,
    contextType: EAssociationContextType.DECLARED_ACTIVITY,
    elementId: 'activity-1',
    mode: Action.ASSOCIATE
  }
  const options = [
    { value: 'trace-1', label: 'Trace', contextType: EAssociationContextType.TRACE },
    { value: 'skill-1', label: 'Skill', contextType: EAssociationContextType.DECLARED_SKILL }
  ]
  const stubs = {
    ConfirmationModal: ConfirmationModalStub,
    QuerySuspense: QuerySuspenseStub,
    AssociationContextTypeSelect: AssociationContextTypeSelectStub,
    AssociationSearchFilterSelect: AssociationSearchFilterSelectStub,
    AssociationCompactCard: AssociationCompactCardStub,
    AssociationsSelector: AssociationsSelectorStub,
    SearchAssociationLayout: SearchAssociationLayoutStub,
    ConfirmManageAssociationModal: ConfirmManageAssociationModalStub
  }
  const onAssociate = vi.fn()
  const onUnassociate = vi.fn()

  function mountModal (overrides: Partial<ManageAssociationModalProps> = {}) {
    wrapper = mountComponent(ManageAssociationModal, { props: { ...props, ...overrides }, global: { stubs } })
  }

  const modal = () => wrapper.findComponent(ConfirmationModalStub)
  const confirmModal = () => wrapper.findComponent(ConfirmManageAssociationModalStub)
  const select = () => wrapper.findComponent(AssociationContextTypeSelectStub)
  const layout = () => wrapper.findComponent(SearchAssociationLayoutStub)

  beforeEach(() => {
    vi.clearAllMocks()
    server.use(
      createGetAssociationsHandler(associations),
      createAssociateHandler(onAssociate),
      http.delete(`*${getUnassociateUrl(props.contextType, props.elementId)}`, async ({ request }) => {
        onUnassociate(await request.json())
        return new HttpResponse(null, { status: 204 })
      })
    )
  })

  afterEach(() => wrapper?.unmount())

  BddTest().when('association is opened with a reached trace limit', () => {
    beforeEach(async () => {
      server.use(createGetAssociationLimitsHandler([
        { associatedContextType: EAssociationContextType.TRACE, max: 1, remaining: 0 }
      ]))
      mountModal({ opened: false })
      await vi.waitFor(() => {
        expect(select().props('contextTypes').find(option => option.type === EAssociationContextType.TRACE)?.disabled).toBe(true)
      })
      await wrapper.setProps({ opened: true })
    })

    BddTest().then('it should disable the reached type and confirmation without a selection', () => {
      const types = select().props('contextTypes')
      expect(types.find(option => option.type === EAssociationContextType.TRACE)?.disabledTooltip).toBeTruthy()
      expect(select().props('modelValue')).toBe(types.find(option => !option.disabled)?.type)
      expect(modal().props('confirmButtonDisabled')).toBe(true)
      expect(modal().props('confirmButtonIcon')).toBe(ICONS.ASSOCIATE)
    })
  })

  BddTest().when('elements of different types are selected for association', () => {
    beforeEach(async () => {
      mountModal()
      layout().vm.$emit('update:modelValue', options)
      await nextTick()
    })

    BddTest().then('it should retain both selected elements', () => {
      expect(modal().props('confirmButtonDisabled')).toBe(false)
      expect(layout().props('items')).toMatchObject([
        { id: 'trace-1', title: 'Trace', contextType: EAssociationContextType.TRACE },
        { id: 'skill-1', title: 'Skill', contextType: EAssociationContextType.DECLARED_SKILL }
      ])
    })

    BddTest().and('the user changes type and removes an item', () => {
      beforeEach(async () => {
        select().vm.$emit('update:modelValue', EAssociationContextType.DECLARED_SKILL)
        await nextTick()
        layout().vm.$emit('delete', 'trace-1')
        await nextTick()
      })

      BddTest().then('it should keep only the remaining item', () => {
        expect(layout().props('items')).toMatchObject([{ id: 'skill-1' }])
      })

      BddTest().and('the user opens and cancels confirmation', () => {
        beforeEach(async () => {
          modal().vm.$emit('confirm')
          await nextTick()
        })

        BddTest().then('it should show the remaining item and preserve it when confirmation is cancelled', async () => {
          expect(confirmModal().props('opened')).toBe(true)
          expect(confirmModal().props('items')).toMatchObject([{ id: 'skill-1', contextType: EAssociationContextType.DECLARED_SKILL }])
          confirmModal().vm.$emit('cancel')
          await nextTick()
          expect(confirmModal().props('opened')).toBe(false)
          expect(layout().props('items')).toHaveLength(1)
        })
      })
    })

    BddTest().and('the user confirms the association', () => {
      beforeEach(async () => {
        modal().vm.$emit('confirm')
        await nextTick()
        confirmModal().vm.$emit('confirm')
      })

      BddTest().then('it should send one association request per selected type', async () => {
        await vi.waitFor(() => expect(onAssociate).toHaveBeenCalledTimes(2))
        expect(onAssociate).toHaveBeenCalledWith(
          expect.objectContaining({ contextType: props.contextType, elementId: props.elementId, associatedContextType: EAssociationContextType.TRACE }),
          { idsToAssociate: ['trace-1'] }
        )
        expect(onAssociate).toHaveBeenCalledWith(
          expect.objectContaining({ contextType: props.contextType, elementId: props.elementId, associatedContextType: EAssociationContextType.DECLARED_SKILL }),
          { idsToAssociate: ['skill-1'] }
        )
        expect(onUnassociate).not.toHaveBeenCalled()
      })
    })

    BddTest().and('the user cancels the main modal', () => {
      beforeEach(async () => {
        select().vm.$emit('update:modelValue', EAssociationContextType.TRACE)
        await nextTick()
        wrapper.findComponent(AssociationSearchFilterSelectStub).vm.$emit('update:modelValue', AssociationSearchFilter.ASSOCIATED)
        layout().vm.$emit('update:search', 'query')
        await nextTick()
        expect(wrapper.findComponent(AssociationSearchFilterSelectStub).props('modelValue')).toBe(AssociationSearchFilter.ASSOCIATED)
        modal().vm.$emit('close')
        await nextTick()
      })

      BddTest().then('it should clear the selection and search, reset the filter and emit cancel', async () => {
        expect(wrapper.emitted('cancel')).toEqual([[]])
        expect(layout().props('items')).toEqual([])
        expect(layout().props('search')).toBe('')
        select().vm.$emit('update:modelValue', EAssociationContextType.TRACE)
        await nextTick()
        expect(wrapper.findComponent(AssociationSearchFilterSelectStub).props('modelValue')).toBe(DEFAULT_ASSOCIATION_SEARCH_FILTER)
        expect(confirmModal().props('opened')).toBe(false)
      })
    })
  })

  BddTest().when('dissociation is opened with existing associations', () => {
    beforeEach(async () => {
      mountModal({ mode: Action.DISSOCIATE })
      await vi.waitFor(() => expect(wrapper.findComponent(AssociationsSelectorStub).exists()).toBe(true))
    })

    BddTest().then('it should enable only types with associations', () => {
      expect(modal().props('confirmButtonIcon')).toBe(ICONS.DISSOCIATE)
      expect(select().props('contextTypes').find(option => option.type === EAssociationContextType.TRACE)?.disabled).toBe(false)
      expect(select().props('contextTypes').find(option => option.type === EAssociationContextType.DECLARED_EXPERIENCE)?.disabled).toBe(true)
      expect(wrapper.findComponent(AssociationsSelectorStub).props('associations')).toEqual(associations)
    })

    BddTest().and('the user selects and confirms associations of different types', () => {
      beforeEach(async () => {
        wrapper.findComponent(AssociationsSelectorStub).vm.$emit('update:modelValue', [traces[0]!.associationId, skills[0]!.associationId])
        await nextTick()
        modal().vm.$emit('confirm')
        await nextTick()
      })

      BddTest().then('it should show both items and send one dissociation request per type', async () => {
        expect(confirmModal().props('items')).toHaveLength(2)
        confirmModal().vm.$emit('confirm')
        await vi.waitFor(() => expect(onUnassociate).toHaveBeenCalledTimes(2))
        expect(onUnassociate).toHaveBeenCalledWith({ idsToDelete: [traces[0]!.associationId] })
        expect(onUnassociate).toHaveBeenCalledWith({ idsToDelete: [skills[0]!.associationId] })
        expect(onAssociate).not.toHaveBeenCalled()
      })
    })
  })

  BddTest().when('dissociation is opened without associations', () => {
    beforeEach(async () => {
      server.use(createGetAssociationsHandler(mockedEmptyAssociations))
      mountModal({ mode: Action.DISSOCIATE })
      await vi.waitFor(() => expect(select().props('modelValue')).toBe(null))
    })

    BddTest().then('it should show an empty state and disable confirmation', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('isEmpty')).toBe(true)
      expect(modal().props('confirmButtonDisabled')).toBe(true)
    })
  })
})
