# Setups

### ToC
1. [Firebase](#firebase)
    - [Create new project](#create-new-firebase-project)
    - [Firebase configs for React](#firebase-configs-for-react)
    - [Firebase Service accounts for APIs](#firebase-service-accounts-for-apis)
2. Security
    - [Remove compromised Firebase service accounts file](#remove-compromised-firebase-service-accounts-file)

### Firebase
#### Create new Firebase project
Go to [Firebase console](https://console.firebase.google.com/) and choose Add Project to create new project.

#### Firebase configs for React
From your firebase project console, choose Authentication > Web Setup, copy those value to `.env`
```
REACTE_APP_FIREBASE_APIKEY="your-apiKey"
REACTE_APP_FIREBASE_DOMAIN="your-authDomain"
REACTE_APP_FIREBASE_DATABASE="your-databaseURL"
```
**Note**: *REACTE_APP_FIREBASE_APIKEY is also used for generate token for testing api*

You don't need remain config value if you don't plan on using other Firebase services (Firebase requires databaseURL even though you don't use Firebase Realtime Database)

#### Firebase Service accounts for APIs
APIs need a token id to [verify](https://firebase.google.com/docs/auth/admin/verify-id-tokens) logged in users, to [create a custom token](https://firebase.google.com/docs/auth/admin/create-custom-tokens) for local development and testing (this custom token is used to exchange a signed token), a service account JSON file is required

Go to `https://console.firebase.google.com/project/YOUR_FIREBASE_PROJECT_ID/settings/serviceaccounts/adminsdk`, click **Generate new private key** to download a new service account file, save this file as `serviceAccountKey.json` under `data/` folder (*this folder is added to gitignore*)

### Security
#### Remove compromised Firebase service accounts file
In case you pulished your service accounts json files, you should remove it from your service account to avoid any problems may occur:
- Go to *Service Accounts* tag in Firebase Console settings, click *Manage all service account*
- From list service account table, choose account with *firebase-adminsdk* and no description (account have key id), click Actions > Edit
- Delete keys with key-id match private_key_id in your compromised service account json file
