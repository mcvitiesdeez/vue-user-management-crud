import { db, storage } from '@/firebase'
import type { FilterOptions, SortField, SortOrder, User, UserFormData } from '@/types/users'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  QueryConstraint,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const USERS_COLLECTION = 'users'
const PROFILE_PHOTOS_PATH = 'profile_photos'

export class UserService {
  //Add new user function
  static async addUser(userData: UserFormData): Promise<string> {
    try {
      const nowDate = new Date()
      let profilepictureUrl = ''

      if (userData.profilepicture) {
        profilepictureUrl = await this.uploadProfilePicture(userData.profilepicture)
      }

      const userDoc = {
        name: userData.name,
        email: userData.email,
        dob: userData.dob,
        gender: userData.gender,
        profilepicture: profilepictureUrl,
        createdAt: Timestamp.fromDate(nowDate),
        updatedAt: Timestamp.fromDate(nowDate),
      }

      const docRef = await addDoc(collection(db, USERS_COLLECTION), userDoc)
      return docRef.id
    } catch (error) {
      console.error('Error adding user:', error)
      throw error
    }
  }

  //Get all users function
  static async getUsers(
    sortField?: SortField,
    sortOrder: SortOrder = 'asc',
    filters?: FilterOptions,
  ): Promise<User[]> {
    try {
      const constraints: QueryConstraint[] = []

      //Add filters to query
      if (filters) {
        if (filters.name) {
          constraints.push(where('name', '>=', filters.name))
          constraints.push(where('name', '<=', filters.name + '\uf8ff'))
        }
        if (filters.email) {
          constraints.push(where('email', '>=', filters.email))
          constraints.push(where('email', '<=', filters.email + '\uf8ff'))
        }
        if (filters.gender) {
          constraints.push(where('gender', '==', filters.gender))
        }
      }

      if (sortField) {
        constraints.push(orderBy(sortField, sortOrder))
      }

      const q = query(collection(db, USERS_COLLECTION), ...constraints)
      const querySnapshot = await getDocs(q)

      const users: User[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()

        let dobString = ''
        if (data.dob) {
          if (data.dob.toDate) {
            dobString = data.dob.toDate().toISOString().split('T')[0]
          } else if (typeof data.dob === 'string') {
            dobString = data.dob
          }
        }

        users.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          dob: dobString,
          gender: data.gender,
          profilepicture: data.profilepicture,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        })
      })
      console.log(users)
      return users
    } catch (error) {
      console.error('Error getting users:', error)
      throw error
    }
  }

  //Update an user function
  static async updateUser(
    userId: string,
    userData: UserFormData,
    currentProfilePicture?: string,
  ): Promise<void> {
    try {
      const nowDate = new Date()
      let profilepictureUrl = currentProfilePicture || ''

      if (userData.profilepicture) {
        if (currentProfilePicture) {
          await this.deleteProfilePicture(currentProfilePicture)
        }
        profilepictureUrl = await this.uploadProfilePicture(userData.profilepicture)
      }

      const updatedData = {
        name: userData.name,
        email: userData.email,
        dob: userData.dob,
        gender: userData.gender,
        profilepicture: profilepictureUrl,
        updatedAt: Timestamp.fromDate(nowDate),
      }

      const userRef = doc(db, USERS_COLLECTION, userId)
      await updateDoc(userRef, updatedData)
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  // Upload profile picture
  private static async uploadProfilePicture(file: File): Promise<string> {
    try {
      const fileName = `${Date.now()}_${file.name}`
      const storageRef = ref(storage, `${PROFILE_PHOTOS_PATH}/${fileName}`)

      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      return downloadURL
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      throw error
    }
  }

  // Delete profile picture
  private static async deleteProfilePicture(profilepictureUrl: string): Promise<void> {
    try {
      const storageRef = ref(storage, profilepictureUrl)
      await deleteObject(storageRef)
    } catch (error) {
      console.error('Error deleting profile picture:', error)
      // Don't throw error for profile picture deletion failure
    }
  }

  //Delete an user function
  static async deleteUser(userId: string, profilepictureUrl?: string): Promise<void> {
    try {
      if (profilepictureUrl) {
        await this.deleteProfilePicture(profilepictureUrl)
      }

      const userRef = doc(db, USERS_COLLECTION, userId)
      await deleteDoc(userRef)
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }
}
