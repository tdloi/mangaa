# Mangaa
[![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/tdloi/mangaa/blob/master/LICENSE)
![react](https://img.shields.io/badge/react-16.8-blue.svg) ![python](https://img.shields.io/badge/python-3.6-blue.svg) [![CircleCI](https://circleci.com/gh/tdloi/mangaa/tree/master.svg?style=svg)](https://circleci.com/gh/tdloi/mangaa/tree/master)

## Table of contents
1. [Prerequisites](#Prerequisites)
2. [Run project](#run-project)
3. [Testing](#testing)
4. [License](#license)

## Prerequisites
You'll need a [Firebase project](https://firebase.google.com) and Amazon S3 Bucket, copy [`.env.example`](.env.example) to `.env` then ***put its configurations in `.env`***

Download [Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk) and save it in `data/serviceAccountKey.json`
## Run project
### Client
```bash
yarn start
```

### API 
**With docker-compose**

```bash
# create postgres_data folder before running compose for persistent data on compose down

# Add -d if you want it to run in background
docker-compose up

# init database
docker-compose run --rm api alembic upgrade heads

# generate test data
# docker-compose run --rm api flask gen testdb
```

<details> 
<summary><b>Without docker-compose</b></summary>
<b>Start venv and install python packages (python 3.6)</b>

<pre lang="bash">
python venv -m .venv
source .venv/bin/activate   // Window: .venv\Scripts\activate.bat
pip install -r requirements/base.txt
</pre>

<b>Database</b>

Update <code>DATABASE_URL</code> to approciate value based on <a href="https://docs.sqlalchemy.org/en/latest/core/engines.html#database-urls">SQLAlchemy Database URLS</a>

<b>Celery</b>

Update Redis Uri for <code>CELERY_BROKER_URL</code> and <code>CELERY_BROKER_URL</code>, alternatively, you can use other <a href="http://docs.celeryproject.org/en/latest/getting-started/brokers/">Broker</a>

<b>Flask</b>
<pre lang="bash">
// Werkzeug
flask run

// Gunicorn
gunicorn "api:create_app()"

// Uwsgi
uwsgi --ini docker/uwsgi/uwsgi.ini
</pre>
For uwsgi, change socket to http in uwsgi.ini
</details>

## Testing
### API test with pytest
+ Create `postgres_test` folder
+ Run test compose in detach mode: `docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d`
+ Run database migrations: `docker-compose run --rm api alembic upgrade heads`
+ Run init test data: `docker-compose run --rm api flask gen testdb`
+ Run test: `docker-compose run --rm api pytest`

## Commands and Scripts
#### `flask gen testdb`
Generate a minium records use for testing
#### `flask gen db`
Similar as `flask gen testdb` but create full set of data, be aware that it will create **a huge mount** of records in Images table
#### scripts `gen_doc`
Generate a `.md` file for each [Blueprint](http://flask.pocoo.org/docs/dev/blueprints/), it will read all functions [docstring](https://www.python.org/dev/peps/pep-0257/) inside the blueprint that has `@route` [decorator](https://www.python.org/dev/peps/pep-0318/)
#### custom scripts
You can create your own custom scripts and put it under `scripts` folder, for scripts requires [application context](http://flask.pocoo.org/docs/dev/appcontext/), import `init` to push the application context, if you need to access `app`, use `from init import app`.

## License
MIT. Unless explicitly state otherwise.
