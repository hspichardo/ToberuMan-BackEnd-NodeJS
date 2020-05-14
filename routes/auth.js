const bcrypt = require('bcrypt');
const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/user')
const router = express.Router();
const httpCodes = require('../resources/httpCodes');
