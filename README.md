## Installation

```bash
$ npm install
```

## Running the app

```bash
$ docker-compose up
$ npm run start
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## Available endpoints

```bash
curl -v -F file=@users.csv localhost:3000/users-csv
curl localhost:3000/users
```
