# Mangaa
[![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/tdloi/mangaa/blob/master/LICENSE)
![react](https://img.shields.io/badge/react-16.8-blue.svg) ![python](https://img.shields.io/badge/python-3.6-blue.svg) [![CircleCI](https://circleci.com/gh/tdloi/mangaa/tree/master.svg?style=svg)](https://circleci.com/gh/tdloi/mangaa/tree/master)

## Table of contents
1. [Pre-requirements](#pre-requirements)
2. [Run project](#run-project)
3. [Testing](#testing)
4. [Configurations](#configurations)
5. [License](#license)

## Pre-requirements
Read [init setups](init-setups.md) to set up required enviroment variables and data for local development

## Run project
### Using docker-compose

```bash
# create postgres_data folder before running compose for persistent data on compose down

# sudo command may be need (linux)
# remove -d if you want to view log on console
docker-compose up -d

# init database
docker-compose run --rm api alembic upgrade heads

# generate test data
docker-compose run --rm api flask gen testdb
```
### Run seperate with yarn and gunicorn
- Run react
```bash
yarn start
```
View [Create create app](https://github.com/facebook/create-react-app) for more available commands
- Run api server with gunicorn
```bash
# setup flask
python -m venv .venv
source .venv/bin/activate # Window: .venv\Script\activate.bat
pip install -r requirements/dev.txt

# init database
alembic upgrade heads
flask gen testdb
gunicorn "app:create_app()"
```
## Testing
### API test with pytest
+ Create `postgres_test` folder
+ Run test compose in detach mode: `docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d`
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

## Configurations
All configurations for flask are loaded from enviroment variables, use `FLASK_ENV` to load specific [config](api.config.py)

Alternative, you can create your own *config object* and load it via `create_app(your_config_object)`

## License
Unless explicit state otherwise, source code of this project is licensed under MIT.
