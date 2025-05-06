import type { AvCardProps } from './types'
import { palette } from '../tokens'

export const defaultAvCardProps: AvCardProps = {
  backgroundColor: palette.background.card,
  borderColor: palette.foreground.stroke,
  height: 'auto',
  width: 'auto',
  titleBackground: palette.background.surfaceBackground,
} as const
