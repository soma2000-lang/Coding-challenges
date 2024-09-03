
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