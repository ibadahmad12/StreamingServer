const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

app.use(cors());

app.get("/video", function (req, res) {
    // Ensure there is a range given for the video
    const range = req.headers.range;
    const video = req.headers.video;

    if (!range || !video) {
        res.status(400).send("Requires Range/Video Title");
    }

    const videoPath = video;
    const videoSize = fs.statSync(`${video}`).size;

    const CHUNK_SIZE = 20 ** 6; // 26MB
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
    new MediaS();

    const readVideoStream = fs.createReadStream(videoPath, { start, end });
    const writeVideoStream = fs.createWriteStream(`./segments/video (${end}) bytes.mp4`);

    readVideoStream.on("data", function (chunk) {
        writeVideoStream.write(chunk);
    });

    readVideoStream.pipe(res);
});

app.listen(8000);
