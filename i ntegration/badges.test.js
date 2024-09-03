const app = require("../../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const { Buffer } = require("node:buffer");

const fixture = require("../fixtures/badges/badges");
const userData = require("../fixtures/user/user")();

const model = require("../../models/badges");

const authService = require("../../services/authService");
const imageService = require("../../services/imageService");
const addUser = require("../utils/addUser");
const cleanDb = require("../utils/cleanDb");

const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants/badges");
const { CONTROLLERS: CONTROLLERS_SUCCESS_MESSAGES } = SUCCESS_MESSAGES;
const { VALIDATORS: ERROR_MESSAGES_VALIDATORS, MISC } = ERROR_MESSAGES;
const { expect } = chai;

let jwt;
let userId;

const superUser = userData[4];
const cookieName = config.get("userToken.cookieName");

chai.use(chaiHttp);

describe("Badges", function () {
  before(async function () {
    userId = await addUser(superUser);
    jwt = authService.generateAuthToken({ userId });
  });

  after(async function () {
    await cleanDb();
  });