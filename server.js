const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes");

app.use(cors());

routes(app);

app.listen(8000);
