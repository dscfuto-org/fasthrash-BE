const { chai, server } = require('./testConfig');
const UserModel = require('../models/UserModel');
/**
 * Test cases to test all the create alert APIs
 * Covered Routes:
 * (1) Create user->collector alert
 * (2) Create collector->organization alert
 * (3) Delete alerts
 * (4) Update alerts
 */
