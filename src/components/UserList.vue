<template>
  <v-card>
    <!-- Header with Controls -->
    <v-card-title>
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <span class="text-h6">Users</span>
        </v-col>
        <v-col cols="auto">
          <v-btn color="success" prepend-icon="mdi-download" @click="exportToCSV">
            Export CSV
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <!-- Controls Row -->
      <v-row class="mt-1 mb-4 d-flex flex-row justify-end" align="start">
        <!-- View Toggle -->
        <v-col cols="12" sm="auto">
          <v-btn-toggle v-model="viewMode" mandatory border="10">
            <v-btn value="list" prepend-icon="mdi-view-list"> List </v-btn>
            <v-btn value="grid" prepend-icon="mdi-view-grid"> Grid </v-btn>
          </v-btn-toggle>
        </v-col>

        <!-- Sort Controls -->
        <v-col cols="12" sm="auto" align-self="end">
          <v-select
            v-model="sortField"
            label="Sort by"
            :items="sortOptions"
            variant="outlined"
            density="compact"
            @update:model-value="handleSort"
          />
        </v-col>

        <v-col cols="12" sm="auto">
          <v-btn
            :prepend-icon="sortOrder === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'"
            @click="toggleSortOrder"
          >
            {{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }}
          </v-btn>
        </v-col>
      </v-row>

      <!-- Filters Row -->
      <v-row class="mb-4">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filters.name"
            label="Filter by Name"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="filters.email"
            label="Filter by Email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            density="compact"
            clearable
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="filters.gender"
            label="Filter by Gender"
            :items="genderFilterOptions"
            variant="outlined"
            density="compact"
            clearable
          />
        </v-col>
      </v-row>

      <!-- Loading State -->
      <v-row v-if="isLoading" justify="center" class="my-8">
        <v-col cols="auto">
          <v-progress-circular indeterminate color="primary" size="64" />
          <p class="text-center mt-4">Loading users...</p>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-row v-else-if="filteredUsers.length === 0" justify="center" class="my-8">
        <v-col cols="auto" class="text-center">
          <v-icon size="64" color="grey">mdi-account-off</v-icon>
          <p class="text-h6 mt-4">No users found</p>
        </v-col>
      </v-row>

      <!-- List View -->
      <v-data-table
        v-else-if="viewMode === 'list'"
        :headers="headers"
        :items="filteredUsers"
        :loading="isLoading"
        item-key="id"
        class="elevation-1"
      >
        <!-- <template #item.profilepicture="{ item }"> -->
        <template v-slot:[`item.profilepicture`]="{ item }">
          <v-avatar size="40" class="my-2">
            <v-img :src="item.profilepicture || placeholderImage" :alt="item.name" />
          </v-avatar>
        </template>

        <!-- <template #item.dob="{ item }"> -->
        <template v-slot:[`item.dob`]="{ item }">
          {{ formatDate(item.dob) }}
        </template>

        <template v-slot:[`item.gender`]="{ item }">
          <v-chip :color="getGenderColor(item.gender)" size="small" variant="flat">
            {{ item.gender }}
          </v-chip>
        </template>

        <template v-slot:[`item.createdAt`]="{ item }">
          {{ formatDateTime(item.createdAt) }}
        </template>

        <template v-slot:[`item.updatedAt`]="{ item }">
          {{ formatDateTime(item.updatedAt) }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            color="primary"
            size="small"
            variant="text"
            icon="mdi-pencil"
            @click="$emit('edit', item)"
          />
          <v-btn
            color="error"
            size="small"
            variant="text"
            icon="mdi-delete"
            @click="$emit('delete', item)"
          />
        </template>
      </v-data-table>

      <!-- Grid View -->
      <v-row v-else>
        <v-col v-for="user in filteredUsers" :key="user.id" cols="12" sm="6" md="4" lg="3">
          <v-card class="mx-auto" max-width="300">
            <v-card-text class="text-center">
              <v-avatar size="80" class="mb-4">
                <v-img :src="user.profilepicture || placeholderImage" :alt="user.name" />
              </v-avatar>

              <h3 class="text-h6 mb-2">{{ user.name }}</h3>
              <p class="text-body-2 mb-1">{{ user.email }}</p>
              <p class="text-body-2 mb-1">DOB: {{ formatDate(user.dob) }}</p>

              <v-chip :color="getGenderColor(user.gender)" size="small" variant="flat" class="mb-3">
                {{ user.gender }}
              </v-chip>

              <div class="text-caption text-medium-emphasis mb-4">
                <p>Created: {{ formatDateTime(user.createdAt) }}</p>
                <p>Updated: {{ formatDateTime(user.updatedAt) }}</p>
              </div>
            </v-card-text>

            <v-card-actions class="justify-center">
              <v-btn
                color="primary"
                variant="text"
                prepend-icon="mdi-pencil"
                @click="$emit('edit', user)"
              >
                Edit
              </v-btn>
              <v-btn
                color="error"
                variant="text"
                prepend-icon="mdi-delete"
                @click="$emit('delete', user)"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User, ViewMode, SortField, SortOrder, FilterOptions } from '../types/users'
import Papa from 'papaparse'

interface Props {
  users: User[]
  isLoading?: boolean
}

interface Emits {
  (e: 'edit', user: User): void
  (e: 'delete', user: User): void
  (e: 'sort', field: SortField, order: SortOrder): void
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const emit = defineEmits<Emits>()

const viewMode = ref<ViewMode>('list')
const sortField = ref<SortField>('name')
const sortOrder = ref<SortOrder>('asc')

const filters = ref<FilterOptions>({
  name: '',
  email: '',
  gender: '',
})

const placeholderImage = '/placeholderProfilePicture.png'

const headers = [
  { title: 'Profile', key: 'profilepicture', sortable: false },
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'DOB', key: 'dob' },
  { title: 'Gender', key: 'gender' },
  { title: 'Created', key: 'createdAt' },
  { title: 'Updated', key: 'updatedAt' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const sortOptions = [
  { title: 'Name', value: 'name' },
  { title: 'Email', value: 'email' },
  { title: 'Date of Birth', value: 'dob' },
  { title: 'Gender', value: 'gender' },
  { title: 'Created At', value: 'createdAt' },
  { title: 'Updated At', value: 'updatedAt' },
]

const genderFilterOptions = [
  { title: 'All Genders', value: '' },
  { title: 'Male', value: 'male' },
  { title: 'Female', value: 'female' },
  { title: 'Other', value: 'other' },
]

// Computed property for filtered users
const filteredUsers = computed(() => {
  let filtered = [...props.users]

  // Apply filters
  if (filters.value.name) {
    filtered = filtered.filter((user) =>
      user.name.toLowerCase().includes(filters.value.name!.toLowerCase()),
    )
  }

  if (filters.value.email) {
    filtered = filtered.filter((user) =>
      user.email.toLowerCase().includes(filters.value.email!.toLowerCase()),
    )
  }

  if (filters.value.gender) {
    filtered = filtered.filter((user) => user.gender === filters.value.gender)
  }

  return filtered
})

const handleSort = () => {
  emit('sort', sortField.value, sortOrder.value)
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  handleSort()
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString()
  } catch {
    return dateString
  }
}

const formatDateTime = (date: Date) => {
  return date.toLocaleString()
}

const getGenderColor = (gender: string) => {
  switch (gender) {
    case 'male':
      return 'blue'
    case 'female':
      return 'pink'
    case 'other':
      return 'purple'
    default:
      return 'grey'
  }
}

const exportToCSV = () => {
  const csvData = filteredUsers.value.map((user) => ({
    Name: user.name,
    Email: user.email,
    'Date of Birth': formatDate(user.dob),
    Gender: user.gender,
    'Profile Picture': user.profilepicture || '',
    'Created At': formatDateTime(user.createdAt),
    'Updated At': formatDateTime(user.updatedAt),
  }))

  const csv = Papa.unparse(csvData)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>

<style scoped>
/* Vuetify handles all styling */
</style>
