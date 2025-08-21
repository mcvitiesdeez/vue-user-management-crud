<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600px"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ isEditing ? 'Edit User' : 'Add New User' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
          <v-container>
            <v-row>
              <!-- Name Field -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.name"
                  label="Name"
                  :rules="nameRules"
                  required
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                />
              </v-col>

              <!-- Email Field -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  type="email"
                  :rules="emailRules"
                  required
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                />
              </v-col>
            </v-row>

            <v-row>
              <!-- Date of Birth Field -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.dob"
                  label="Date of Birth"
                  type="date"
                  :rules="dobRules"
                  required
                  variant="outlined"
                  prepend-inner-icon="mdi-calendar"
                />
              </v-col>

              <!-- Gender Field -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.gender"
                  label="Gender"
                  :items="genderOptions"
                  :rules="genderRules"
                  required
                  variant="outlined"
                  prepend-inner-icon="mdi-human-male-female"
                />
              </v-col>
            </v-row>

            <v-row align="center">
              <!-- Profile Picture Field -->
              <v-col cols="12" sm="8">
                <v-file-input
                  ref="fileInput"
                  v-model="fileModel"
                  label="Profile Picture"
                  accept="image/*"
                  variant="outlined"
                  prepend-inner-icon="mdi-camera"
                  hint="Optional: Upload a profile picture"
                  persistent-hint
                  @change="handleFileChange($event)"
                />
              </v-col>
              <v-col cols="12" sm="4" class="d-flex justify-center">
                <v-avatar size="80" class="elevation-2">
                  <v-img
                    :src="previewUrl || placeholderImage"
                    :alt="formData.name || 'Profile preview'"
                    cover
                  />
                </v-avatar>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <!-- Form Actions -->
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn color="grey" variant="text" @click="handleCancel"> Cancel </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="isSubmitting"
          :disabled="!valid"
          @click="handleSubmit"
        >
          {{ isEditing ? 'Update User' : 'Add User' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { User, UserFormData } from '../types/users'

interface Props {
  modelValue: boolean
  isEditing?: boolean
  currentUser?: User | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: UserFormData): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  currentUser: null,
})

const emit = defineEmits<Emits>()

const formRef = ref()
const fileInput = ref()
const valid = ref(false)
const isSubmitting = ref(false)
const fileModel = ref<File[]>([])

const formData = reactive<UserFormData>({
  name: '',
  email: '',
  dob: '',
  gender: 'male',
  profilepicture: null,
})

const genderOptions = [
  { title: 'Male', value: 'male' },
  { title: 'Female', value: 'female' },
  { title: 'Other', value: 'other' },
]

// Validation rules
const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => v.length >= 2 || 'Name must be at least 2 characters',
]

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
]

const dobRules = [(v: string) => !!v || 'Date of birth is required']

const genderRules = [(v: string) => !!v || 'Gender is required']

const previewUrl = ref<string | null>(null)
const placeholderImage =
  'https://firebasestorage.googleapis.com/v0/b/vue-user-management-649ca.firebasestorage.app/o/profile_photos%2FplaceholderProfilePicture.png?alt=media&token=5c6b58a3-c8c9-462f-9fb5-689e3e014f33'

watch(
  () => props.currentUser,
  (newUser) => {
    if (newUser && props.isEditing) {
      formData.name = newUser.name
      formData.email = newUser.email
      formData.dob = newUser.dob
      formData.gender = newUser.gender
      formData.profilepicture = null
      fileModel.value = []
      previewUrl.value = newUser.profilepicture || null
    }
  },
  { immediate: true },
)

const handleFileChange = (event: Event & { target: HTMLInputElement }) => {
  const file = event.target?.files?.[0] || null
  formData.profilepicture = file
}

const handleSubmit = async () => {
  const { valid: isValid } = await formRef.value.validate()
  if (!isValid) return

  isSubmitting.value = true

  try {
    console.log('Form data:', formData)
    const submitData: UserFormData = {
      name: formData.name,
      email: formData.email,
      dob: formData.dob,
      gender: formData.gender,
      profilepicture: formData.profilepicture,
    }
    emit('submit', submitData)
    emit('update:modelValue', false)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  formData.name = ''
  formData.email = ''
  formData.dob = ''
  formData.gender = 'male'
  formData.profilepicture = null
  fileModel.value = []
  previewUrl.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  formRef.value?.reset()

  emit('update:modelValue', false)
  emit('cancel')
}

watch(
  () => props.isEditing,
  (isEditing) => {
    if (!isEditing) {
      handleCancel()
    }
  },
)
</script>

<style scoped></style>
