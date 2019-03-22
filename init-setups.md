# Setups

### ToC
1. [Firebase](#firebase)
    - [Create new project](#create-new-firebase-project)
    - [Firebase configs for React](#firebase-configs-for-react)
    - [Firebase Service accounts for APIs](#firebase-service-accounts-for-apis)
    - [Note: Remove unused/compromised keys](#note-remove-unused--compromised-firebase-service-accounts-file)
2. [AWS S3](#aws-s3)
    - [New AWS Account](#new-aws-account)
    - [AWS configurations file](#aws-configurations-file)
3. [Database](#database)

## Firebase
### Create new Firebase project
Go to [Firebase console](https://console.firebase.google.com/) and choose **Add Project** to create new project.

#### Firebase configs for React
From your firebase project console, choose **Authentication** > **Web Setup**, copy those value to `.env` (**does not** include double quotes)
```ini
REACT_APP_FIREBASE_APIKEY=your-apiKey
REACT_APP_FIREBASE_DOMAIN=your-authDomain
REACT_APP_FIREBASE_DATABASE=your-databaseURL
```
**Note**: *REACT_APP_FIREBASE_APIKEY is also used for generate token for testing api*

### Firebase Service accounts for APIs
Go to [Service Account](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk), click **Generate new private key** to download a new service account file, save this file as `serviceAccountKey.json` under `data/` folder (*this folder is added to gitignore*)

### Note: Remove unused / compromised Firebase service accounts file
In case you pulished your service accounts json file by mistakes, you can remove it from your service account to avoid any unwanted problems may occur:
- Go to *Service Accounts* tag in Firebase Console settings, click *Manage all service account*
- From list service account table, choose account with *firebase-adminsdk* and no description (account have key id), click Actions > Edit
- Delete keys with key-id match private_key_id in your compromised service account json file


## AWS S3
### New AWS account
This instruction is a quickstart for someone new to AWS, read AWS documents for more details.
1. Create new [AWS Account](https://aws.amazon.com)
2. Create new [Group](https://console.aws.amazon.com/iam/home#/groups):
    + On *Attach policy* choose *AmazonS3FullAccess*
3. On [Group Permission](https://console.aws.amazon.com/iam/home#/groups/), choose *Create Group Policy* > Custom Policy, paste this to *Policy Document* field:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:ListUsers",
                "iam:GetAccountPasswordPolicy"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:*AccessKey*",
                "iam:ChangePassword",
                "iam:GetUser",
                "iam:*ServiceSpecificCredential*",
                "iam:*SigningCertificate*"
            ],
            "Resource": [
                "arn:aws:iam::*:user/${aws:username}"
            ]
        }
    ]
}
```
4. Create new User to Group (this user is used to limit access level)
5. Login to your new created IAM user and create new S3 Buckets
### AWS configurations file
+ Go to [Security credentials](https://console.aws.amazon.com/iam/home#/security_credentials), choose create access key and paste it (along with your created bucket name) to **.env**
### AWS Bucket Policy
+ Go to your *Bucket > Permissions > Bucket Policy*, copy (and edit) following Bucket Policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PreventHotlinking",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*",
            "Condition": {
                "StringLike": {
                    "aws:Referer": [
                        "YOUR_DOMAIN"  // Referer header
                    ]
                }
            }
        }
    ]
}
```
To access (display) images on localhost, your can add another entry to [allows only your IP Address](https://docs.aws.amazon.com/AmazonS3/latest/dev/example-bucket-policies.html#example-bucket-policies-use-case-3), or remove *Condition* from Bucket Policy

## Database
### Docker-compose
View [.env.example](.env.example) for details, for local developments, you don't need to set `POSTGRES_PASSWORD`

If you also want to change username, database name, change DATABASE_URL bases on their values (read [postgres doc on docker](https://hub.docker.com/_/postgres) for more info)

<pre>DATABASE_URL=postgresql://<b>POSTGRES_USER</b>:<b>POSTGRES_PASSWORD</b>@db:5432/<b>POSTGRES_DB</b>
</pre>

### Gunicorn

You can use `SQLite` for database, set `DATABASE_URL=sqlite:///tmp/sqlite.db` will save `sqlite.db` file to `tmp` folder
