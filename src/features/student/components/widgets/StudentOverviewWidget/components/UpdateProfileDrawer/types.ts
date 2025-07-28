export interface UpdateProfileDrawerForm {
  email: string
  firstname: string
  lastname: string
  bio: string
  coverPicture: string
  profilePicture: string
}

export type FormKeys = keyof UpdateProfileDrawerForm
