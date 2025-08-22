# Vue User Management System

A modern, full-featured user management system built with Vue 3, TypeScript, Vuetify, and Firebase. This application provides complete CRUD (Create, Read, Update, Delete) functionality for managing user profiles with an intuitive and responsive interface.

## 🚀 Features

- **Complete CRUD Operations**: Add, view, edit, and delete user profiles
- **Profile Picture Management**: Upload and manage user profile pictures with Firebase Storage
- **Form Validation**: Comprehensive form validation for user data
- **Sorting & Filtering**: Sort users by various fields (name, email, date of birth, etc.)
- **Responsive Design**: Mobile-friendly interface built with Vuetify
- **Real-time Updates**: Automatic synchronization with Firebase Firestore
- **Confirmation Dialogs**: Safe deletion with confirmation prompts
- **Notifications**: User-friendly success and error notifications
- **TypeScript Support**: Full TypeScript integration for better development experience

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **UI Framework**: Vuetify 3
- **Build Tool**: Vite
- **Backend**: Firebase (Firestore + Storage)
- **Icons**: Material Design Icons
- **Package Manager**: pnpm
- **Code Quality**: ESLint + Prettier

## 📋 User Data Model

Each user profile contains:

- **Name**: Full name of the user
- **Email**: Email address (with validation)
- **Date of Birth**: User's birth date
- **Gender**: Male, Female, or Other
- **Profile Picture**: Optional profile image (stored in Firebase Storage)
- **Timestamps**: Created and updated timestamps

## 🔧 Prerequisites

- **Node.js**: Version 20.19.0+ or 22.12.0+
- **pnpm**: Package manager
- **Firebase Project**: Set up with Firestore and Storage enabled

## ⚙️ Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database** in production mode
3. Enable **Firebase Storage**
4. Create a web app and get your configuration
5. Update your Firebase security rules:

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{document} {
      allow read, write: if true; // Adjust based on your security needs
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile_photos/{allPaths=**} {
      allow read, write: if true; // Adjust based on your security needs
    }
  }
}
```

6. Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🚀 Installation & Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd vue-user-management
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**
   - Copy your Firebase configuration to `.env` file (see Firebase Setup above)

4. **Start development server**

```bash
pnpm dev
```

5. **Open in browser**
   - Navigate to `http://localhost:5173`

## 📝 Available Scripts

```bash
# Start development server with hot-reload
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm type-check

# Lint and fix code
pnpm lint

# Format code with Prettier
pnpm format
```

## 🎯 Usage Guide

### Adding a New User

1. Click the **"Add New User"** button
2. Fill in the required fields (name, email, date of birth, gender)
3. Optionally upload a profile picture
4. Click **"Save"** to create the user

### Editing a User

1. Find the user in the list
2. Click the **Edit** button (pencil icon)
3. Modify the desired fields
4. Click **"Save"** to update

### Deleting a User

1. Find the user in the list
2. Click the **Delete** button (trash icon)
3. Confirm the deletion in the dialog

### Sorting Users

- Click on column headers to sort by that field
- Toggle between ascending and descending order

## 🧪 Testing with Sample Data

For testing profile pictures, you can use **[This Person Does Not Exist](https://thispersondoesnotexist.com/)** to generate realistic profile photos:

1. Visit [https://thispersondoesnotexist.com/](https://thispersondoesnotexist.com/)
2. Right-click on the generated image and save it
3. Use the saved image when adding/editing user profiles
4. Refresh the page to generate different faces for testing multiple users

This service generates AI-created faces that are perfect for testing and demo purposes without using real people's photos.

## 📁 Project Structure

```
vue-user-management/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── G2G Logo.png
│   └── placeholderProfilePicture.png
├── src/
│   ├── components/         # Vue components
│   │   ├── UserFormDialog.vue
│   │   ├── UserList.vue
│   │   └── UserManagementPage.vue
│   ├── services/          # Firebase services
│   │   └── userService.ts
│   ├── types/             # TypeScript type definitions
│   │   └── users.ts
│   ├── App.vue           # Root component
│   ├── main.ts          # Application entry point
│   └── firebase.ts      # Firebase configuration
├── .env                 # Environment variables
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## 🔧 Key Components

- **`UserManagementPage`**: Main container component handling user operations
- **`UserList`**: Displays users in a responsive table with sorting and actions
- **`UserFormDialog`**: Modal form for adding and editing users
- **`UserService`**: Service layer for all Firebase operations (CRUD + file upload)

## 🎨 UI/UX Features

- **Material Design**: Clean and modern interface using Vuetify
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Visual feedback during data operations
- **Error Handling**: User-friendly error messages and notifications
- **Confirmation Dialogs**: Prevents accidental data deletion

## 🔒 Security Considerations

- **Input Validation**: Client-side form validation
- **File Upload Security**: Controlled file types and sizes for profile pictures
- **Firebase Security Rules**: Configure appropriate read/write permissions
- **Environment Variables**: Sensitive data stored in `.env` file

## 🐛 Troubleshooting

**Build Issues:**

- Ensure Node.js version meets requirements (20.19.0+ or 22.12.0+)
- Clear node_modules and reinstall: `rm -rf node_modules pnpm-lock.yaml && pnpm install`

**Firebase Connection Issues:**

- Verify `.env` file contains correct Firebase configuration
- Check Firebase project settings and ensure Firestore/Storage are enabled
- Verify network connectivity to Firebase services

**Profile Picture Upload Issues:**

- Check Firebase Storage rules allow uploads
- Verify file size limits (default: images should be reasonable size)
- Ensure supported file formats (JPG, PNG, etc.)

## 📚 Development

### Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- Disable Vetur if installed

### Type Support for `.vue` Imports

TypeScript cannot handle type information for `.vue` imports by default, so we use `vue-tsc` for type checking. In editors, [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) makes the TypeScript language service aware of `.vue` types.

## 📖 Further Configuration

See [Vite Configuration Reference](https://vite.dev/config/) for build tool customization.

---

**Happy coding!** 🎉 For questions or contributions, please open an issue or submit a pull request.
