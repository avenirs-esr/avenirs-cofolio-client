import type { PictureDTO } from '@/api/avenir-esr'

export interface UpdateProfileDrawerForm {
  email: string
  firstname: string
  lastname: string
  bio: string
  coverPicture: PictureDTO
  profilePicture: PictureDTO
}

export type FormKeys = keyof UpdateProfileDrawerForm
