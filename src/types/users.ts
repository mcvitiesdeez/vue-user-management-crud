export type Gender = 'male' | 'female' | 'other' | ''

export interface User {
  id: string
  name: string
  email: string
  dob: string
  gender: Gender
  profilepicture?: string
  createdAt: Date
  updatedAt: Date
}

export type SortField = 'name' | 'email' | 'dob' | 'gender' | 'createdAt' | 'updatedAt'
export type SortOrder = 'asc' | 'desc'
export type ViewMode = 'list' | 'grid'

export interface UserFormData {
  name: string
  email: string
  dob: string
  gender: Gender
  profilepicture?: File | null
}

export interface FilterOptions {
  name?: string
  email?: string
  dob?: string
  gender?: Gender
  createdAt?: string
  updatedAt?: string
}
