describe("Purged Cache Metadata", function () {
    let jwt;
  
    after(async function () {
      await cleanDb();
      sinon.restore();
    });
    describe("GET /cache", function () {
        before(async function () {
          await cleanDb();
          const userId = await addUser(userData[0]);
          jwt = authService.generateAuthToken({ userId });
        });
    
        it("Should return no cache is cleared yet if no cache logs found in last 24 hours", function (done) {
          chai
            .request(app)
            .get("/cache")
            .set("cookie", `${cookieName}=${jwt}`)
            .end((error, response) => {
              if (error) {
                return done(error);
              }
    
              expect(response).to.have.status(200);
              expect(response.body).to.be.an("object");
              expect(response.body.message).to.equal("No cache is cleared yet");
              expect(response.body.remainingCount).to.equal(3);
              return done();
            });
        });

        it("Should return latest purged cache metadata in last 24 hours", function (done) {
            sinon.stub(logsQuery, "fetchCacheLogs").returns(cacheData.cacheModelData);
            chai
              .request(app)
              .get("/cache")
              .set("cookie", `${cookieName}=${jwt}`)
              .end((error, response) => {
                if (error) {
                  return done(error);
                }
      
                expect(response).to.have.status(200);
                expect(response.body).to.be.an("object");
                expect(response.body.message).to.equal("Purged cache metadata returned successfully!");
                expect(response.body.remainingCount).to.be.a("number");
                expect(response.body.timeLastCleared).to.be.a("number");
      
                return done();
              });
          });
          it("Should return latest purged cache metadata in last 24 hours", function (done) {
            sinon.stub(logsQuery, "fetchCacheLogs").returns(cacheData.cacheModelData);
            chai
              .request(app)
              .get("/cache")
              .set("cookie", `${cookieName}=${jwt}`)
              .end((error, response) => {
                if (error) {
                  return done(error);
                }
      
                expect(response).to.have.status(200);
                expect(response.body).to.be.an("object");
                expect(response.body.message).to.equal("Purged cache metadata returned successfully!");
                expect(response.body.remainingCount).to.be.a("number");
                expect(response.body.timeLastCleared).to.be.a("number");
      
                return done();
              });
          });
          beforeEach(async function () {
            sinon.stub(cloudflare, "purgeCache").returns(cacheData.purgeCacheResponse[0]);
          });
      
          afterEach(async function () {
            sinon.restore();
          });


    afterEach(async function () {
        sinon.restore();
      });
  
      it("Should purge the cache of member's profile page", function (done) {
        chai
          .request(app)
          .post("/cache")
          .set("cookie", `${cookieName}=${jwt}`)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
  
            expect(res).to.have.status(200);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal("Cache purged successfully");
            expect(res.body.success).to.equal(true);
            expect(res.body.errors).to.deep.equal([]);
            expect(res.body.messages).to.deep.equal([]);
            expect(res.body.result).to.be.a("object");
            expect(res.body.result.id).to.be.a("string");
  
            return done();
          });
      });
      it("Should purge the cache by superuser of member's profile page", function (done) {
        chai
          .request(app)
          .post("/cache")
          .set("cookie", `${cookieName}=${jwt}`)
          .send({ user: userData[0].username })
          .end((err, res) => {
            if (err) {
              return done(err);
            }
  
            expect(res).to.have.status(200);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal("Cache purged successfully");
            expect(res.body.success).to.equal(true);
            expect(res.body.errors).to.deep.equal([]);
            expect(res.body.messages).to.deep.equal([]);
            expect(res.body.result).to.be.a("object");
            expect(res.body.result.id).to.be.a("string");
  
            return done();
          });
      });

      it("Should return unauthorized error when not logged in", function (done) {
        chai
          .request(app)
          .post("/cache")
          .end((err, res) => {
            if (err) {
              return done(err);
            }
  
            expect(res).to.have.status(401);
            expect(res.body).to.eql({
              statusCode: 401,
              error: "Unauthorized",
              message: "Unauthenticated User",
            });
            return done();
          });
      });
    });
  });  