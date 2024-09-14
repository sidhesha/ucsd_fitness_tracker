# UCSD Fitness Tracker
Fitness app for UCSD students providing personalized workouts based on RIMAC's available equipment, as well as fostering a fitness community. Project for CSE210.

## Structure

`/client` - Frontend
* `/client/public` - Frontend template files
* `/client/src` - React source code 

`/server` - Backend
* `/server/auth` - Google authentication handler
* `/server/config` - Config file (`.env`)
* `/server/database` - Database setup and schemas
* `/server/routes` - API routes and controllers


## Usage

`/server/config/.env` should set:
* `GOOGLE_CLIENT_ID` - Google OAuth credentials client ID
* `GOOGLE_CLIENT_SECRET` - Google OAuth credentials client secret
* `SESSION_SECRET` - Secret string to hash session IDs against
* `MONGO_URI` - URI for MongoDB Atlas database
* `PORT` - Port on localhost to run client (front-end)
* `API_PORT` - Port on localhost to run server (back-end)

### Setup

`npm install`

### Client

`npm run build` - build the client

`npm run client` - start the client

### Server

`npm run server` - serve the server

`npm run start:server` - start the server

### Development

`npm start` - start client and server

### Test

`npm test` - run aggregated tests
