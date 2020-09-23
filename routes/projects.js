const express = require('express');
const User = require('../models/user');
const router = express.Router();
const _ = require('lodash');
// const { user } = require('../config/connection');
const auth = require('../middleware/authenticate');
const admin = require('../middleware/admin');

