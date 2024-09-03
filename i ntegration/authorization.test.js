const chai = require("chai");
const { expect } = chai;

const { authorizeUser } = require("../../middlewares/authorization");
const authenticate = require("../../middlewares/authenticate");
const authService = require("../../services/authService");
const addUser = require("../utils/addUser");
const cleanDb = require("../utils/cleanDb");
const config = require("config");
const cookieName = config.get("userToken.cookieName");
const userData = require("../fixtures/user/user")();

const defaultUser = userData[0]; // user with no `roles` key
const appOwner = userData[3];
const superUser = userData[4];

// Setup some routes with various permissions for testing
const express = require("express");
const router = express.Router();
const AppMiddlewares = require("../../middlewares");

const pongHandler = (_, res) => {
  return res.json({ message: "pong" });
};

router.get("/for-everyone", authenticate, pongHandler);
router.get("/for-app-owner", authenticate, authorizeUser("appOwner"), pongHandler);
router.get("/for-super-user", authenticate, authorizeUser("superUser"), pongHandler);

const app = express();
AppMiddlewares(app);
app.use("/", router);

const app = express();
AppMiddlewares(app);
app.use("/", router);

describe("authorizeUser", function () {
    let defaultJwt, appOwnerJwt, superUserJwt;
  
    before(async function () {
      const defaultUserId = await addUser(defaultUser);
      const appOwnerId = await addUser(appOwner);
      const superUserId = await addUser(superUser);
      defaultJwt = authService.generateAuthToken({ userId: defaultUserId });
      appOwnerJwt = authService.generateAuthToken({ userId: appOwnerId });
      superUserJwt = authService.generateAuthToken({ userId: superUserId });
    });
}
    
  after(async function () {
    await cleanDb();
  });


  it("should authorize default user for route with no required role", function (done) {
    chai
      .request(app)
      .get("/for-everyone")
      .set("cookie", `${cookieName}=${defaultJwt}`)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res).to.have.status(200);
        return done();
      });
  });
  