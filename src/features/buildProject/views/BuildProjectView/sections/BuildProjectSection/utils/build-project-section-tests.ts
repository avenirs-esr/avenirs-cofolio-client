import { GLOBAL_NODE_TYPES } from '@/common/components/VueFlow/global-nodes.types'
import { MIND_MAP_NODE_TYPES } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/mind-map-nodes.types'
import { RESEARCHS_NODE_TYPES } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/researchs-nodes.types'
import { SELF_KNOWLEDGE_NODE_TYPES } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/self-knowledge-nodes.types'
import { TRAJECTORIES_NODE_TYPES } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/trajectories-nodes.types'
import { h } from 'vue'

const nodePrefix = 'node-'
const nodeNames = [
  MIND_MAP_NODE_TYPES.USER,
  MIND_MAP_NODE_TYPES.MAIN_SECTION,
  SELF_KNOWLEDGE_NODE_TYPES.SELF_KNOWLEDGE_CATEGORY,
  SELF_KNOWLEDGE_NODE_TYPES.ADD_SELF_KNOWLEDGE_CATEGORY_BUTTON,
  SELF_KNOWLEDGE_NODE_TYPES.ADD_SELF_KNOWLEDGE_ELEMENT_BUTTON,
  SELF_KNOWLEDGE_NODE_TYPES.SELF_KNOWLEDGE_ELEMENT,
  TRAJECTORIES_NODE_TYPES.TRAJECTORY,
  TRAJECTORIES_NODE_TYPES.ADD_TRAJECTORY_BUTTON,
  RESEARCHS_NODE_TYPES.RESEARCH,
  RESEARCHS_NODE_TYPES.ADD_RESEARCH_BUTTON,
  GLOBAL_NODE_TYPES.TEXT_INPUT,
  GLOBAL_NODE_TYPES.LINK_INPUT,
]

export const VueFlowStub = defineComponent({
  name: 'VueFlow',
  props: {
    nodes: { type: Array, required: true },
    edges: { type: Array, required: true },
  },
  emits: ['connect'],
  setup (_, { slots }) {
    return () =>
      h(
        'div',
        nodeNames.map((name) => {
          const slotName = nodePrefix + name
          return h('div', slots[slotName]?.({ data: { label: slotName } }))
        })
      )
  },
})
