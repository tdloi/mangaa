# Setups

### ToC
1. [Firebase](#firebase)
    - [Create new project](#create-new-firebase-project)
    - [Firebase configs for React](#firebase-configs-for-react)
    - [Firebase Service accounts for APIs](#firebase-service-accounts-for-apis)
2. [Database](#database)
3. [Security](#security)
    - [Remove compromised Firebase service accounts file](#remove-compromised-firebase-service-accounts-file)

## Firebase
### Create new Firebase project
Go to [Firebase console](https://console.firebase.google.com/) and choose **Add Project** to create new project.

#### Firebase configs for React
From your firebase project console, choose **Authentication** > **Web Setup**, copy those value to `.env`
```
REACTE_APP_FIREBASE_APIKEY="your-apiKey"
REACTE_APP_FIREBASE_DOMAIN="your-authDomain"
REACTE_APP_FIREBASE_DATABASE="your-databaseURL"
```
**Note**: *REACTE_APP_FIREBASE_APIKEY is also used for generate token for testing api*

### Firebase Service accounts for APIs
APIs need a token id to [verify](https://firebase.google.com/docs/auth/admin/verify-id-tokens) logged in users, to [create a custom token](https://firebase.google.com/docs/auth/admin/create-custom-tokens) for local development and testing (this custom token is used to exchange a signed token), a service account JSON file is required

Go to [Service Account](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk), click **Generate new private key** to download a new service account file, save this file as `serviceAccountKey.json` under `data/` folder (*this folder is added to gitignore*)

## Database
- Docker-compose

Set `POSTGRES_PASSWORD` and put it in `DATABASE_URL`, view [.env.example](.env.example) (make sure them put them before DATABASE_URL)

If you also want to change username, database name, change DATABASE_URL bases on their values (read [postgres doc on docker](https://hub.docker.com/_/postgres) for more info)

`DATABASE_URL`=postgresql://`POSTGRES_USER`:`POSTGRES_PASSWORD`@db:5432/`POSTGRES_DB`

- Gunicorn

You can use `SQLite` for database, set `DATABASE_URL=sqlite:///tmp/sqlite.db` will save `sqlite.db` file to `tmp` folder

## Security
### Remove compromised Firebase service accounts file
In case you pulished your service accounts json file by mistakes, you can remove it from your service account to avoid any unwanted problems may occur:
- Go to *Service Accounts* tag in Firebase Console settings, click *Manage all service account*
- From list service account table, choose account with *firebase-adminsdk* and no description (account have key id), click Actions > Edit
- Delete keys with key-id match private_key_id in your compromised service account json file
