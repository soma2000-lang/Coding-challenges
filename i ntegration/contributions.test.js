/* eslint-disable no-unused-expressions */
const chai = require("chai");
const sinon = require("sinon");
const { expect } = chai;
const chaiHttp = require("chai-http");

const githubService = require("../../services/githubService");
const testModel = require("../../models/tasks");
const userModel = require("../../models/users");

const app = require("../../server");

chai.use(chaiHttp);

// Import fixtures
const githubPRInfo = require("../fixtures/contributions/githubPRInfo")();
