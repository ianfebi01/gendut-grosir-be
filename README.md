# gendut-grosir-be

Backend for Gendut Grosir — Express + Mongoose + MongoDB, written in TypeScript.

## Prerequisites

- [Docker](https://www.docker.com/) (for MongoDB)
- Node.js 22+

## 1. Configure `.env`

Copy `.env.example` to `.env` and fill in:

```
PORT = 8000
DATABASE_URL = mongodb://<user>:<password>@localhost:27017/gendut-grosir-skripsi?retryWrites=true&w=majority&authSource=admin
TOKEN_SECRET = ...
CLOUD_NAME = ...
CLOUD_API_KEY = ...
CLOUD_API_SECRET = ...
MONGO_INITDB_ROOT_USERNAME = <user>
MONGO_INITDB_ROOT_PASSWORD = <password>
```

> **Important:** the MongoDB root user is created in the `admin` database, so
> `DATABASE_URL` must include `authSource=admin` — without it the app fails
> with `Authentication failed`.

## 2. Start MongoDB

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts a `mongodb` container (mongo:8.0) on port `27017` with data
persisted in the `mongo_data_3` volume. Credentials come from
`MONGO_INITDB_ROOT_USERNAME` / `MONGO_INITDB_ROOT_PASSWORD` in `.env`.

## 3. Restore the database

```bash
docker exec -i mongodb mongorestore \
  --archive --gzip --drop \
  --uri="mongodb://<user>:<password>@127.0.0.1:27017/?authSource=admin" \
  < gendut-grosir-skripsi.archive.gz
```

Restores all collections (categories, products, orders, roles, users,
stockopnames, menus) into the `gendut-grosir-skripsi` database.

## 4. Install & run

```bash
npm install
npm run dev        # tsx watch — reloads on change
```

The API listens on http://localhost:8000. You should see:

```
listening on port 8000
Connected to database
```

## Project layout

```
src/
  index.ts          entrypoint: DB connection + listen
  app.ts            express app + middleware
  config.ts         env vars (loads .env)
  routes/           express routers (mounted in routes/index.ts)
  controllers/      request handlers
  models/           mongoose schemas
  middlewares/      authUser, isAdmin, imageUpload
  helpers/          jwt, validation, pagination, etc.
  docs/openapi.ts   OpenAPI spec
```

## Test account

| Email              | Password | Role        |
| ------------------ | -------- | ----------- |
| akuntes@gmail.com  | 123456   | super_admin |

## Smoke test

```bash
# Login
curl -X POST http://localhost:8000/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"akuntes@gmail.com","password":"123456"}'

# Authenticated request (use accessToken from the login response)
curl http://localhost:8000/category \
  -H "Authorization: Bearer <accessToken>"
```

## Useful commands

```bash
# Stop MongoDB (keeps data)
docker compose -f docker-compose.dev.yml down

# Stop MongoDB AND delete the volume (data is gone — restore again afterwards)
docker compose -f docker-compose.dev.yml down -v

# Inspect the DB from inside the container
docker exec -it mongodb mongosh \
  "mongodb://<user>:<password>@127.0.0.1:27017/?authSource=admin"
```
