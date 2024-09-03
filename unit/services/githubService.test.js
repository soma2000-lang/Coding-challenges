const chai = require("chai");
const sinon = require("sinon");
const { expect } = chai;

const cleanDb = require("../../utils/cleanDb");
const addUser = require("../../utils/addUser");
const axios = require("../../../utils/fetch");

const githubService = require("../../../services/githubService");
const githubUserInfo = require("../../fixtures/auth/githubUserInfo")();
const { prDates } = require("../../fixtures/pullrequests/pullrequests");
describe("githubService", function () {
  beforeEach(async function () {
    sinon.stub(axios, "fetch").returnsArg(0);
  });

  afterEach(async function () {
    await cleanDb();
    sinon.restore();
  });
  describe("fetchOpenPRs", function () {
    it("Should generate the correct url to fetch open PRs", async function () {
      const response = await githubService.fetchOpenPRs();
      expect(response).to.be.equal(
        "https://api.github.com/search/issues?q=org%3AReal-Dev-Squad+type%3Apr+is%3Aopen&sort=created&per_page=100&page=1"
      );
    });
  });
  describe("fetchOpenPRs with additional params", function () {
    it("Should generate the correct url to fetch open PRs", async function () {
      const params = {
        searchParams: {
          created: "2023-01-01..2023-02-01",
        },
        resultOptions: {
          order: "desc",
        },
      };
      const response = await githubService.fetchOpenPRs(params);
      expect(response).to.be.equal(
        "https://api.github.com/search/issues?q=org%3AReal-Dev-Squad+type%3Apr+is%3Aopen+created%3A2023-01-01..2023-02-01&sort=created&order=desc&per_page=100&page=1"
      );
    });
  });

