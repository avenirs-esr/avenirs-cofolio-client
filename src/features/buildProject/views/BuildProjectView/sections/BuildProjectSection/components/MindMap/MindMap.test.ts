import type { Edge, Node } from '@vue-flow/core'
import type { VueWrapper } from '@vue/test-utils'
import { LinkInputNodeStub } from '@/common/components/VueFlow/LinkInputNode/LinkInputNode.stub'
import { TextInputNodeStub } from '@/common/components/VueFlow/TextInputNode/TextInputNode.stub'
import { AddResearchButtonNodeStub } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/AddResearchButtonNode/AddResearchButtonNode.stub'
import { AddSelfKnowledgeCategoryButtonNodeStub } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/AddSelfKnowledgeCategoryButtonNode/AddResearchButtonNode.stub'
import { AddSelfKnowledgeElementButtonNodeStub } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/AddSelfKnowledgeElementButtonNode/AddSelfKnowledgeElementButtonNode.stub'
import { AddTrajectoryButtonNodeStub } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/AddTrajectoryButtonNode/AddTrajectoryButtonNode.stub'
import { MainSectionNodeStub } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MainSectionNode/MainSectionNode.stub'
import MindMap from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/MindMap.vue'
import { ResearchNodeStub } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/ResearchNode/ResearchNode.stub'
import { SelfKnowledgeCategoryNodeStub } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/SelfKnowledgeCategoryNode/SelfKnowledgeCategoryNode.stub'
import { SelfKnowledgeElementNodeStub } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/SelfKnowledgeElementNode/SelfKnowledgeElementNode.stub'
import { TrajectoryNodeStub } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/TrajectoryNode/TrajectoryNode.stub'
import { UserNodeStub } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/UserNode/UserNode.stub'
import { VueFlowStub } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/utils/build-project-section-tests'
import { AvButtonStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockNodes = ref<Node[]>([])
const mockEdges = ref<Edge[]>([])
const mockSetNodes = vi.fn()
const mockSetEdges = vi.fn()
const mockSaveCurrentState = vi.fn()
const mockRestoreSavedState = vi.fn()
const mockResetToInitialState = vi.fn()
const mockCanUndo = vi.fn().mockReturnValue(false)
const mockCanRedo = vi.fn().mockReturnValue(false)
const mockRedo = vi.fn()
const mockUndo = vi.fn()
const mockDoScreenshot = vi.fn()
const mockOnConnect = vi.fn()

vi.mock('@vue-flow/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vue-flow/core')>()
  return {
    ...actual,
    useVueFlow: () => ({
      nodes: mockNodes,
      edges: mockEdges,
      setNodes: mockSetNodes,
      setEdges: mockSetEdges,
    }),
  }
})

vi.mock('@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/composables/use-mind-map-flow/use-mind-map-flow', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/composables/use-mind-map-flow/use-mind-map-flow')>()
  return {
    ...actual,
    useMindMapFlow: () => ({
      saveCurrentState: mockSaveCurrentState,
      restoreSavedState: mockRestoreSavedState,
      resetToInitialState: mockResetToInitialState,
    }),
  }
})

vi.mock('@/common/stores/flow-history.store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/stores/flow-history.store')>()
  return {
    ...actual,
    useFlowHistoryStore: () => ({
      canUndo: mockCanUndo,
      canRedo: mockCanRedo,
      redo: mockRedo,
      undo: mockUndo,
    }),
  }
})

vi.mock('@/common/composables/VueFlow/use-flow-screenshot/use-flow-screenshot', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/VueFlow/use-flow-screenshot/use-flow-screenshot')>()
  return {
    ...actual,
    useFlowScreenshot: () => ({
      doScreenshot: mockDoScreenshot,
    }),
  }
})

vi.mock('@/common/composables/VueFlow/use-edges/use-edges', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/VueFlow/use-edges/use-edges')>()
  return {
    ...actual,
    useEdges: () => ({
      onConnect: mockOnConnect,
    }),
  }
})

BddTest().given('a MindMap', () => {
  let wrapper: VueWrapper<InstanceType<typeof MindMap>>

  const stubs = {
    AvIconText: AvIconTextStub,
    AvButton: AvButtonStub,
    VueFlow: VueFlowStub,
    UserNode: UserNodeStub,
    MainSectionNode: MainSectionNodeStub,
    SelfKnowledgeCategoryNode: SelfKnowledgeCategoryNodeStub,
    AddSelfKnowledgeCategoryButtonNode: AddSelfKnowledgeCategoryButtonNodeStub,
    AddSelfKnowledgeElementButtonNode: AddSelfKnowledgeElementButtonNodeStub,
    SelfKnowledgeElementNode: SelfKnowledgeElementNodeStub,
    TrajectoryNode: TrajectoryNodeStub,
    AddTrajectoryButtonNode: AddTrajectoryButtonNodeStub,
    ResearchNode: ResearchNodeStub,
    AddResearchButtonNode: AddResearchButtonNodeStub,
    TextInputNode: TextInputNodeStub,
    LinkInputNode: LinkInputNodeStub,
  }

  BddTest().when('the mind map is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(MindMap, { global: { stubs } }, { usePinia: true })
    })

    BddTest().then('it should render the title', () => {
      const avIconText = wrapper.findComponent(AvIconTextStub)
      expect(avIconText.exists()).toBe(true)
      expect(avIconText.props('text')).toBe('Ma carte mentale')
    })

    BddTest().then('it should render the undo button', () => {
      const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Annuler')
      expect(avButton).toBeDefined()
    })

    BddTest().then('the undo button should be initially disabled', () => {
      const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Annuler')
      expect(avButton).toBeDefined()
      expect(avButton!.props('disabled')).toBe(true)
    })

    BddTest().then('it should render the redo button', () => {
      const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Rétablir')
      expect(avButton).toBeDefined()
    })

    BddTest().then('the redo button should be initially disabled', () => {
      const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Rétablir')
      expect(avButton).toBeDefined()
      expect(avButton!.props('disabled')).toBe(true)
    })

    BddTest().then('it should render the save button', () => {
      const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Enregistrer')
      expect(avButton).toBeDefined()
    })

    BddTest().then('it should render the restore button', () => {
      const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Restaurer')
      expect(avButton).toBeDefined()
    })

    BddTest().then('it should render the reset button', () => {
      const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Réinitialiser')
      expect(avButton).toBeDefined()
    })

    BddTest().then('it should render the screenshot button', () => {
      const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Capture d\'écran')
      expect(avButton).toBeDefined()
    })

    BddTest().then('it should render the VueFlow component with the correct props', () => {
      const vueFlowComponent = wrapper.findComponent(VueFlowStub)
      expect(vueFlowComponent.exists()).toBe(true)
      expect(vueFlowComponent.props('edges')).toEqual(mockEdges.value)
      expect(vueFlowComponent.props('nodes')).toEqual(mockNodes.value)
    })

    BddTest().then('it should render the correct node components', () => {
      expect(wrapper.findComponent(UserNodeStub).exists()).toBe(true)
      expect(wrapper.findComponent(MainSectionNodeStub).exists()).toBe(true)
      expect(wrapper.findComponent(SelfKnowledgeCategoryNodeStub).exists()).toBe(true)
      expect(wrapper.findComponent(AddSelfKnowledgeCategoryButtonNodeStub).exists()).toBe(true)
      expect(wrapper.findComponent(AddSelfKnowledgeElementButtonNodeStub).exists()).toBe(true)
      expect(wrapper.findComponent(SelfKnowledgeElementNodeStub).exists()).toBe(true)
      expect(wrapper.findComponent(TrajectoryNodeStub).exists()).toBe(true)
      expect(wrapper.findComponent(AddTrajectoryButtonNodeStub).exists()).toBe(true)
      expect(wrapper.findComponent(ResearchNodeStub).exists()).toBe(true)
      expect(wrapper.findComponent(AddResearchButtonNodeStub).exists()).toBe(true)
      expect(wrapper.findComponent(TextInputNodeStub).exists()).toBe(true)
      expect(wrapper.findComponent(LinkInputNodeStub).exists()).toBe(true)
    })

    BddTest().and('the save button is clicked', () => {
      beforeEach(() => {
        const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Enregistrer')
        expect(avButton).toBeDefined()
        avButton!.vm.$emit('click')
      })

      BddTest().then('it should call the saveCurrentState method', () => {
        expect(mockSaveCurrentState).toHaveBeenCalled()
      })
    })

    BddTest().and('the restore button is clicked', () => {
      beforeEach(() => {
        const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Restaurer')
        expect(avButton).toBeDefined()
        avButton!.vm.$emit('click')
      })

      BddTest().then('it should call the restoreSavedState method', () => {
        expect(mockRestoreSavedState).toHaveBeenCalled()
      })
    })

    BddTest().and('the reset button is clicked', () => {
      beforeEach(() => {
        const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Réinitialiser')
        expect(avButton).toBeDefined()
        avButton!.vm.$emit('click')
      })

      BddTest().then('it should call the resetToInitialState method', () => {
        expect(mockResetToInitialState).toHaveBeenCalled()
      })
    })

    BddTest().and('the screenshot button is clicked', () => {
      beforeEach(() => {
        const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Capture d\'écran')
        expect(avButton).toBeDefined()
        avButton!.vm.$emit('click')
      })

      BddTest().then('it should call the doScreenshot method', () => {
        expect(mockDoScreenshot).toHaveBeenCalled()
      })
    })
  })

  BddTest().when('the mind map is mounted with canUndo and canRedo true', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mockCanUndo.mockReturnValue(true)
      mockCanRedo.mockReturnValue(true)
      wrapper = mountComponent(MindMap, { global: { stubs } }, { usePinia: true })
    })

    BddTest().then('the undo button should be enabled', () => {
      const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Annuler')
      expect(avButton).toBeDefined()
      expect(avButton!.props('disabled')).toBe(false)
    })

    BddTest().then('the redo button should be enabled', () => {
      const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Rétablir')
      expect(avButton).toBeDefined()
      expect(avButton!.props('disabled')).toBe(false)
    })

    BddTest().and('the undo button is clicked', () => {
      beforeEach(() => {
        const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Annuler')
        expect(avButton).toBeDefined()
        avButton!.vm.$emit('click')
      })

      BddTest().then('it should call the undo method', () => {
        expect(mockUndo).toHaveBeenCalled()
      })
    })

    BddTest().and('the redo button is clicked', () => {
      beforeEach(() => {
        const avButton = wrapper.findAllComponents(AvButtonStub).find(button => button.props('label') === 'Rétablir')
        expect(avButton).toBeDefined()
        avButton!.vm.$emit('click')
      })

      BddTest().then('it should call the redo method', () => {
        expect(mockRedo).toHaveBeenCalled()
      })
    })
  })
})
