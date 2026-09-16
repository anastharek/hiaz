const dotenv = require("dotenv");
dotenv.config();
var createError = require("http-errors");
var express = require("express");
var morgan = require("morgan");
var path = require("path");
var cookieParser = require("cookie-parser");
const compression = require("compression");
const { startSocketServer } = require("./socket/socketServer");
var apisRouter = require("./routes/index");
var adminRouter = require("./routes/admin");
var usersRouter = require("./routes/users");
var authenticationRouter = require("./routes/authentication");
require("./cron/index");
var app = express();
var autoStartMonitoring = require("./model/monitoring/AutoStartMonitoring");

const OTJSError = require("./Exceptions/OTJSError");
const http = require("http").createServer(app);

// CORS — allow the PUTRACNS viewer origin to call the external-login
// endpoint and set the `external` cookie (DICOMweb study grants).
const cors = require("cors");
app.use(
  cors({
    origin: [
      "https://fastpacs.anzverse.com",
      "https://fastpacsviewer.anzverse.com",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);

app.set("trust proxy", true);
app.use(
  express.raw({ limit: "2000mb", type: ["application/dicom", "text/plain"] })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "100mb" }));

app.use(cookieParser());
app.use(compression({ level: 9 }));

var unless = function (path, middleware) {
  return function (req, res, next) {
    if (path === req.path) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

morgan.token("username", function (req, res) {
  return req.roles == null ? "Not Authentified" : req.roles.username;
});

morgan.token("remote-addr", (req, res) => {
  return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
});

app.use(
  unless(
    "/",
    morgan(
      ':remote-addr - [:date[clf]] ":method :url HTTPS/:http-version" :status ":user-agent" ":username" :total-time[ms] :response-time[ms]'
    )
  )
);

// Long-lived immutable cache for hashed/versioned assets (content-hashed
// JS/WASM bundles). index.html + app-config.js stay no-cache so new builds
// propagate immediately without a hard refresh.
const setCacheHeaders = function (res, filePath) {
  if (/index\.html$/.test(filePath) || /app-config\.js$/.test(filePath)) {
    res.setHeader("Cache-Control", "no-cache");
  } else {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
};
const staticOpts = { setHeaders: setCacheHeaders };

// static routes
app.use("/sounds", express.static(path.join(__dirname, "build", "sounds"), staticOpts));
app.use("/images", express.static(path.join(__dirname, "build", "images"), staticOpts));
app.use("/static", express.static(path.join(__dirname, "build", "static"), staticOpts));

app.use(
  "/viewer-ohif/",
  express.static(path.join(__dirname, "build", "viewer-ohif"), staticOpts)
);
app.use("/viewer-ohif/*", function (req, res) {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(__dirname, "build", "viewer-ohif", "index.html"));
});

app.use(
  "/viewer-stone/",
  express.static(path.join(__dirname, "build", "viewer-stone"), staticOpts)
);
app.use(
  "/streamSaver/",
  express.static(path.join(__dirname, "build", "streamSaver"), staticOpts)
);

app.use("/api/authentication", authenticationRouter);
app.use("/api/users", usersRouter);
app.use("/api", apisRouter);
app.use("/api", adminRouter);

// Runtime config injected into the frontend at page load.
// Lets external viewer hosts (Osimis / Stone) be changed via env vars
// without rebuilding the frontend. Falls back to the compiled defaults when
// the env vars are unset.
app.get("/config.js", function (req, res) {
  res.setHeader("Cache-Control", "no-cache");
  res.type("application/javascript");
  res.send(
    "window.__PACS_CONFIG__ = " +
      JSON.stringify({
        osimisViewerHost: process.env.OSIMIS_VIEWER_HOST || "",
        stoneViewerHost: process.env.STONE_VIEWER_HOST || "",
        legacyPadiHost: process.env.LEGACY_PADI_HOST || "",
      }) +
      ";\n"
  );
});

app.use("/*", express.static(path.join(__dirname, "build")));

// If didn't found route catch 404 and forward to error handler
//SK A améliorer ne tient pas compte des routes dans le subrouter
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (req.app.get("env") === "development") {
    console.error(err);
  }

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof OTJSError) {
    res.status(err.getStatusCode()).json(err.getJsonPayload());
    return;
  } else {
    return next(err);
  }
});
const port = 4000;

const server = app.listen(port, (error) => {
  if (error) {
    console.error(error);
    return process.exit(1);
  } else {
    console.log("Listening on port: " + port);
    if (app.get("env") === "production") {
      //Autostart monitonring service if needed
      autoStartMonitoring();
    }
  }
});

startSocketServer(server); //concurrent tukar

module.exports = app;
