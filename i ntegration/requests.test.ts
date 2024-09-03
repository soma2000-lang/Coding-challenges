import chai from "chai";
const { expect } = chai;
import chaiHttp from "chai-http";
import _ from "lodash";
import config from "config";
import app from "../../server";
import cleanDb from "../utils/cleanDb";
import authService from "../../services/authService";
import userDataFixture from "../fixtures/user/user";
const cookieName = config.get("userToken.cookieName");
import addUser from "../utils/addUser";
import {
  createOooRequests,
  validOooStatusRequests,
  validOooStatusUpdate,
  createOooRequests2,
} from "../fixtures/oooRequest/oooRequest";
import { createRequest, updateRequest } from "../../models/requests";
import {
  REQUEST_ALREADY_APPROVED,
  REQUEST_STATE,
  REQUEST_TYPE,
  REQUEST_APPROVED_SUCCESSFULLY,
  REQUEST_CREATED_SUCCESSFULLY,
  REQUEST_DOES_NOT_EXIST,
  REQUEST_ALREADY_PENDING,
  REQUEST_REJECTED_SUCCESSFULLY,
  REQUEST_ALREADY_REJECTED,
} from "../../constants/requests";
import { updateTask } from "../../models/tasks";
import { validTaskAssignmentRequest, validTaskCreqtionRequest } from "../fixtures/taskRequests/taskRequests";

const userData = userDataFixture();
chai.use(chaiHttp);

let authToken: string;
let superUserToken: string;
let oooRequestId: string;
let pendingOooRequestId: string;
let approvedOooRequestId: string;
let oooRequestData: any;
let oooRequestData2: any;
let testUserId: string;

describe("/requests OOO", function () {
    beforeEach(async function () {
      const userIdPromises = [addUser(userData[16]), addUser(userData[4])];
      const [userId, superUserId] = await Promise.all(userIdPromises);
      testUserId = userId;
  
      oooRequestData = { ...createOooRequests, requestedBy: userId };
      oooRequestData2 = { ...createOooRequests2, requestedBy: superUserId };
  
      const { id: oooRequestStatusId }: any = await createRequest(oooRequestData);
      oooRequestId = oooRequestStatusId;
      const { id: pendingOooId }: any = await createRequest(oooRequestData2);
      pendingOooRequestId = pendingOooId;
  
      const { id: approveOooId }: any = await updateRequest(oooRequestId, { state: REQUEST_STATE.APPROVED }, superUserId, REQUEST_TYPE.OOO);
      approvedOooRequestId = approveOooId;
  
      authToken = authService.generateAuthToken({ userId });
      superUserToken = authService.generateAuthToken({ userId: superUserId });
    });
  
    afterEach(async function () {
      await cleanDb();
    });

    describe("POST /requests", function () {
        it("should return 401 if user is not logged in", function (done) {
          chai
            .request(app)
            .post("/requests?dev=true")
            .send(validOooStatusRequests)
            .end(function (err, res) {
              expect(res).to.have.status(401);
              done();
            });
        });

        it("should create a new request", function (done) {
            chai
              .request(app)
              .post("/requests?dev=true")
              .set("cookie", `${cookieName}=${authToken}`)
              .send(validOooStatusRequests)
              .end(function (err, res) {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal(REQUEST_CREATED_SUCCESSFULLY);
                done();
              });
          });


    it("should return 400, if already created request is created again", async function () {
        await chai
          .request(app)
          .post("/requests?dev=true")
          .set("cookie", `${cookieName}=${authToken}`)
          .send(validOooStatusRequests);
        const response = await chai
          .request(app)
          .post("/requests?dev=true")
          .set("cookie", `${cookieName}=${authToken}`)
          .send(validOooStatusRequests);
        expect(response).to.have.status(400);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.equal(REQUEST_ALREADY_PENDING);
      });

      it("should create a new request and have all the required fields in the response", function (done) {
        chai
          .request(app)
          .post("/requests?dev=true")
          .set("cookie", `${cookieName}=${authToken}`)
          .send(validOooStatusRequests)
          .end(function (err, res) {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("message");
            expect(Object.keys(res.body.data)).to.have.lengthOf(9);
            expect(res.body.data.until).to.be.above(res.body.data.from);
            expect(res.body.data).to.have.property("requestedBy");
            expect(res.body.data.type).to.equal(REQUEST_TYPE.OOO);
            expect(res.body.data.state).to.equal(REQUEST_STATE.PENDING);
            expect(res.body.message).to.equal(REQUEST_CREATED_SUCCESSFULLY);
            done();
          });
      });
      it("should return error if feature flag is not used", function (done) {
        chai
          .request(app)
          .post("/requests")
          .set("cookie", `${cookieName}=${authToken}`)
          .send(validOooStatusRequests)
          .end(function (err, res) {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.equal("Please use feature flag to make this requests");
            done();
          });
      });
      it("should create a new request", function (done) {
        chai
          .request(app)
          .post("/requests?dev=true")
          .set("cookie", `${cookieName}=${authToken}`)
          .send(validOooStatusRequests)
          .end(function (err, res) {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.equal(REQUEST_CREATED_SUCCESSFULLY);
            done();
          });
      });
      
      it("should return error if invalid type is passed", function (done) {
        const type = "ACTIVE";
        chai
          .request(app)
          .post("/requests?dev=true")
          .set("cookie", `${cookieName}=${authToken}`)
          .send({ ...validOooStatusRequests, type })
          .end(function (err, res) {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.equal(`Invalid request type: ${type}`);
            done();
          });
      });
      it("should return error if message is not present in body", function (done) {
        chai
          .request(app)
          .post("/requests?dev=true")
          .set("cookie", `${cookieName}=${authToken}`)
          .send(_.omit(validOooStatusRequests, "message"))
          .end(function (err, res) {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.equal("message is required");
            done();
          });
      });

      it("should return error if state in the body is not PENDING", function (done) {
        chai
          .request(app)
          .post("/requests?dev=true")
          .set("cookie", `${cookieName}=${authToken}`)
          .send({ ...validOooStatusRequests, state: REQUEST_STATE.APPROVED })
          .end(function (err, res) {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.equal("state must be PENDING");
            done();
          });
      });
    });


    describe("PUT /requests/:id", function () {
        it("should return 401 if user is not logged in", function (done) {
          chai
            .request(app)
            .put(`/requests/${oooRequestId}?dev=true`)
            .send(validOooStatusUpdate)
            .end(function (err, res) {
              expect(res).to.have.status(401);
              done();
            });
        });

        