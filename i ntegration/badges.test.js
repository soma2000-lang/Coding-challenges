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
  describe("GET /badges", function () {
    it("Should get all the list of badges", function (done) {
      sinon.stub(model, "fetchBadges").returns(fixture.BADGES);
      chai
        .request(app)
        .get("/badges")
        .end(function (error, response) {
          if (error) {
            return done();
          }

          expect(response).to.have.status(200);
          expect(response.body).to.be.a("object");
          expect(response.body.message).to.equal(CONTROLLERS_SUCCESS_MESSAGES.GET_BADGES);
          expect(response.body.badges).to.be.a("array");
          expect(response.body.badges).to.have.length(3);
          expect(response.body.badges[0]).to.deep.equal(fixture.BADGES[0]);

          return done();
        });
    });
  });

  describe("POST /badges", function () {
    it("Should return user is unauthorized", function (done) {
      chai
        .request(app)
        .post("/badges")
        .end(function (error, response) {
          if (error) {
            return done();
          }
          expect(response).to.have.status(401);
          expect(response.body.message).to.contains(MISC.UNAUTHENTICATED_USER);
          expect(response.body.error).to.equal("Unauthorized");
          return done();
        });
    });
    it("Should return file is missing", function (done) {
        chai
          .request(app)
          .post("/badges")
          .set("cookie", `${cookieName}=${jwt}`)
          .end(function (error, response) {
            if (error) {
              return done();
            }
            expect(response).to.have.status(400);
            expect(response.body.message).to.contains(ERROR_MESSAGES_VALIDATORS.CREATE_BADGE.FILE_IS_MISSING);
            expect(response.body.error).to.equal("Bad Request");
  
            return done();
          });
      });


  describe("GET /badges", function () {
    it("Should get all the list of badges", function (done) {
      sinon.stub(model, "fetchBadges").returns(fixture.BADGES);
      chai
        .request(app)
        .get("/badges")
        .end(function (error, response) {
          if (error) {
            return done();
          }

          expect(response).to.have.status(200);
          expect(response.body).to.be.a("object");
          expect(response.body.message).to.equal(CONTROLLERS_SUCCESS_MESSAGES.GET_BADGES);
          expect(response.body.badges).to.be.a("array");
          expect(response.body.badges).to.have.length(3);
          expect(response.body.badges[0]).to.deep.equal(fixture.BADGES[0]);

          return done();
        });
    });
  });

  describe("POST /badges", function () {
    it("Should return user is unauthorized", function (done) {
      chai
        .request(app)
        .post("/badges")
        .end(function (error, response) {
          if (error) {
            return done();
          }
          expect(response).to.have.status(401);
          expect(response.body.message).to.contains(MISC.UNAUTHENTICATED_USER);
          expect(response.body.error).to.equal("Unauthorized");
          return done();
        });
    });
