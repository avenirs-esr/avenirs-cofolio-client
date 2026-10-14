import type { NodeTemplateProps } from '@/common/components/base/VueFlow/NodeTemplate/NodeTemplate.vue'

export enum MIND_MAP_NODE_TYPES {
  MAIN_SECTION = 'main-section',
  USER = 'user',
}

export type MindMapNodeTemplateProps = Omit<NodeTemplateProps, 'flowId'>
