
const pongHandler = (_, res) => {
    return res.json({ message: "pong" });
  };
  
  router.get("/for-app-owner", authenticate, authorizeRoles([APPOWNER]), pongHandler);
  router.get("/for-super-user", authenticate, authorizeRoles([SUPERUSER]), pongHandler);
  router.get("/for-super-user-and-app-owner", authenticate, authorizeRoles([SUPERUSER, APPOWNER]), pongHandler);
  router.get("/for-invalid", authenticate, authorizeRoles(["invalid"]), pongHandler);


const app = express();
AppMiddlewares(app);
app.use("/", router);

describe("GET /for-app-owner", function () {
    it("should authorize app owner for route with app_owner required role", function (done) {
      chai
        .request(app)
        .get("/for-app-owner")
        .set("cookie", `${cookieName}=${appOwnerJwt}`)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res).to.have.status(200);
          return done();
        });
    });

    describe("GET /for-super-user-and-app-owner", function () {
        it("should allow app owner for route with super_user or app_owner required role", function (done) {
          chai
            .request(app)
            .get("/for-super-user-and-app-owner")
            .set("cookie", `${cookieName}=${appOwnerJwt}`)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              expect(res).to.have.status(200);
              return done();
            });
        });