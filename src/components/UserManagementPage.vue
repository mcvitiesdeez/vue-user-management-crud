<template>
  <v-container class="d-flex justify-center">
    <v-row class="d-flex justify-center">
      <h1>User Management Page</h1>
    </v-row>
  </v-container>

  <v-row>
    <v-col class="d-flex justify-center">
      <v-btn
        v-if="!showDialog"
        color="primary"
        size="large"
        prepend-icon="mdi-plus"
        @click="showDialogHandler"
        >Add New User
      </v-btn>
    </v-col>
  </v-row>

  <v-row v-if="showDialog">
    <v-col>
      <!-- Insert user form -->
      <UserFormDialog
        v-model="showDialog"
        :is-editing="isEditing"
        :current-user="currentUser"
        @submit="handleUserSubmit"
        @cancel="handleDialogCancel"
      />
    </v-col>
  </v-row>
  <!-- User List -->
  <v-row>
    <v-col>
      <UserList
        :users="users"
        :is-loading="isLoading"
        @edit="handleEditUser"
        @delete="handleDeleteUser"
        @sort="handleSort"
      />
    </v-col>
  </v-row>

  <v-dialog v-model="showDeleteModal" max-width="500">
    <v-card>
      <v-card-title class="text-h5"> Confirm Delete </v-card-title>

      <v-card-text>
        Are you sure you want to delete <strong>{{ userToDelete?.name }}</strong
        >? This action cannot be undone.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="cancelDelete"> Cancel </v-btn>
        <v-btn color="error" variant="flat" :loading="isDeleting" @click="confirmDelete">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar
    v-model="notification.show"
    :color="notification.type === 'success' ? 'success' : 'error'"
    :timeout="3000"
    location="top right"
  >
    {{ notification.message }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="notification.show = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { UserService } from '../services/userService'
import type { SortField, SortOrder, User, UserFormData } from '../types/users'
import UserFormDialog from './UserFormDialog.vue'
import UserList from './UserList.vue'
import { onMounted, reactive, ref } from 'vue'

const users = ref<User[]>([])
const isLoading = ref(false)
const showDialog = ref(false)
const isEditing = ref(false)
const currentUser = ref<User | null>(null)
const showDeleteModal = ref(false)
const userToDelete = ref<User | null>(null)
const isDeleting = ref(false)

onMounted(() => {
  loadUsers()
})

const loadUsers = async (sortField?: SortField, sortOrder?: SortOrder) => {
  isLoading.value = true
  try {
    users.value = await UserService.getUsers(sortField, sortOrder)
  } catch (error) {
    console.error('Error loading users:', error)
    showNotification('Failed to load users', 'error')
  } finally {
    isLoading.value = false
  }
}

const notification = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error',
})

const showNotification = (message: string, type: 'success' | 'error') => {
  notification.message = message
  notification.type = type
  notification.show = true
}

const showDialogHandler = () => {
  showDialog.value = true
  isEditing.value = false
  currentUser.value = null
}
const handleUserSubmit = async (formData: UserFormData) => {
  try {
    if (isEditing.value && currentUser.value) {
      await UserService.updateUser(
        currentUser.value.id!,
        formData,
        currentUser.value.profilepicture,
      )
      showNotification('User updated successfully!', 'success')
    } else {
      await UserService.addUser(formData)
      showNotification('User added successfully!', 'success')
    }
    handleDialogCancel()
    loadUsers()
  } catch (error) {
    console.error('Error saving user:', error)
    showNotification('Failed to save user', 'error')
  }
}

const handleDialogCancel = () => {
  showDialog.value = false
  isEditing.value = false
  currentUser.value = null
}

const handleEditUser = (user: User) => {
  currentUser.value = user
  isEditing.value = true
  showDialog.value = true
}

const handleDeleteUser = (user: User) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!userToDelete.value) return

  isDeleting.value = true
  try {
    await UserService.deleteUser(userToDelete.value.id!, userToDelete.value.profilepicture)
    showNotification('User deleted successfully!', 'success')
    loadUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
    showNotification('Failed to delete user', 'error')
  } finally {
    isDeleting.value = false
    cancelDelete()
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  userToDelete.value = null
  isDeleting.value = false
}

const handleSort = (field: SortField, order: SortOrder) => {
  loadUsers(field, order)
}
</script>
