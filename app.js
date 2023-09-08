const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("dotenv").config()

const indexRouter = require('./routes/index.route');
const authRouter = require('./routes/auth.routes');
const notebookRouter = require('./routes/notebooks.route');
const noteRouter = require('./routes/notes.route');
const tagRouter = require('./routes/tags.route');

const {errorLogger, failSafeHandler} = require("./middlewares/error-handler");
const cors = require('cors')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())

// routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/notebooks', notebookRouter);
app.use('/notes', noteRouter);
app.use('/tags', tagRouter);


// middlewares
app.use(errorLogger)
app.use(failSafeHandler)

module.exports = app;
