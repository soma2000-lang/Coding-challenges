import chai, { expect } from "chai";
import chaiHttp from "chai-http";
const sinon = require("sinon");
const config = require("config");
const app = require("../../server");
chai.use(chaiHttp);
 


beforeEach(async function () {

})
afterEach(async funtion(){
    await cleardb();

})

describe("POST answers - createAnswer", function ()


{
    afterEach(function () {
        sinon.restore();
      });
      it("Should return 500 if the request is incorrect",function(done)
    {
        sinon.stub(answerQuery, "createAnswer").throws(new Error());
    })
    chai
    .request(app)
    .post("/answers")
    .send(answerDataArray[1])
    .end((error, response) => {
      if (error) {
        return done(error);
      }

      expect(response).to.have.status(500);
      expect(response.body.message).to.equal("An internal server error occurred");

      return done();
    });


});

it("should update the status with REJECTED value and set reviewed_by with rds user id if user is super user", function (done) {
    sinon.stub(answerQuery, "updateAnswer").returns(answerDataArray[2]);

    const payload: { status: AnswerStatus } = {
      status: "REJECTED",
    };

    chai
      .request(app)
      .patch(`/answers/${answerDataArray[2].id}`)
      .set("cookie", `${cookieName}=${superUserAuthToken}`)
      .send(payload)
      .end((error, response) => {
        if (error) {
          return done(error);
        }
        expect(response).to.have.status(204);

        return done();
      });
  });
  it("should update the status with APPROVED value and set reviewed_by with rds user id if user is super user", function (done) {
    sinon.stub(answerQuery, "updateAnswer").returns(answerDataArray[2]);

    const payload: { status: AnswerStatus } = {
      status: "APPROVED",
    };

    chai
      .request(app)
      .patch(`/answers/${answerDataArray[2].id}`)
      .set("cookie", `${cookieName}=${superUserAuthToken}`)
      .send(payload)
      .end((error, response) => {
        if (error) {
          return done(error);
        }
        expect(response).to.have.status(204);

        return done();
      });
  });

  it("should update the status with REJECTED value and set reviewed_by with rds user id if user is member", function (done) {
    sinon.stub(answerQuery, "updateAnswer").returns(answerDataArray[2]);

    const payload: { status: AnswerStatus } = {
      status: "REJECTED",
    };

    chai
      .request(app)
      .patch(`/answers/${answerDataArray[2].id}`)
      .set("cookie", `${cookieName}=${memberAuthToken}`)
      .send(payload)
      .end((error, response) => {
        if (error) {
          return done(error);
        }
        expect(response).to.have.status(204);

        return done();
      });
  });
  it("should update the status with APPROVED value and set reviewed_by to rds user id if user is member", function (done) {
    sinon.stub(answerQuery, "updateAnswer").returns(answerDataArray[2]);

    const payload: { status: AnswerStatus } = {
      status: "APPROVED",
    };

    chai
      .request(app)
      .patch(`/answers/${answerDataArray[2].id}`)
      .set("cookie", `${cookieName}=${memberAuthToken}`)
      .send(payload)
      .end((error, response) => {
        if (error) {
          return done(error);
        }
        expect(response).to.have.status(204);

        return done();
      });
  });
  it("should return not authorized if user is not super user or member", function (done) {
    sinon.stub(answerQuery, "updateAnswer").returns(answerDataArray[2]);

    const payload: { status: AnswerStatus } = {
      status: "REJECTED",
    };

    chai
      .request(app)
      .patch(`/answers/${answerDataArray[2].id}`)
      .set("cookie", `${cookieName}=${defaultUserAuthToken}`)
      .send(payload)
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        expect(response).to.have.status(401);
        expect(response.body.message).to.be.a("string");
        expect(response.body.error).to.be.equal("Unauthorized");
        expect(response.body.message).to.be.equal("You are not authorized for this action.");

        return done();
      });
  });
