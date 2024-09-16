"use strict";

const router = require("express")();
const fs = require("fs");

router.get("/:name", function (req, res) {
    const range = req.headers.range;
    const video = req.params.name;

    if (!range || !video) {
        res.status(400).send("Requires Range/Video Title");
    }

    const videoPath = __dirname + `/../assets/${video}`;
    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6; // 1 MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    };

    res.writeHead(206, headers);

    const readVideoStream = fs.createReadStream(videoPath, { start, end });

    readVideoStream.pipe(res);
});

module.exports = router;
