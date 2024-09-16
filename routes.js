module.exports = function (app) {
    app.use("/video/", require("./controllers/Video"));
};
