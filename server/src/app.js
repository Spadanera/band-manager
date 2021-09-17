"use strict";
import path from 'path';
const formData = require("express-form-data");
const os = require("os");

// Mongoose configuration
import mongoose from "mongoose";
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = require('bluebird');
var connectionString = process.env.CONNECTION_STRING || 'mongodb://server-database:27017/gig-addicted';
mongoose.connect(connectionString, { promiseLibrary: require('bluebird'), useNewUrlParser: true,  useUnifiedTopology: true })
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error(err, connectionString));

// Express Confiuration
const PORT = process.env.PORT || 3000;
import express, { json, urlencoded } from 'express';
import cors from "cors";
const app = express();
app.use(json({ limit: "300mb" }));
app.use(urlencoded({ extended: true, limit: "300mb" }));
app.use(cors());

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};
 
// parse data with connect-multiparty. 
app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
app.use(formData.format());
// change the file objects to fs.ReadStream 
app.use(formData.stream());
// union the body and the files
app.use(formData.union());

// Auth Configuration
import passport from 'passport';
import auth from './oauth';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
auth(passport);
app.use(passport.initialize());
app.use(cookieSession({
  name: 'session',
  keys: ['123'],
  maxAge: 24 * 60 * 60 * 1000 * 365, // 24 hours
  secure: process.env.PROTOCOL === "HTTPS"
}));
app.use(cookieParser());

// Auth routing
app.use("/auth", require('./routes/middlewares/auth').default);

// API routing
app.use("/api", require("./routes/router").default);

// Static content
app.use(express.static(path.join(__dirname, 'static')));

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});