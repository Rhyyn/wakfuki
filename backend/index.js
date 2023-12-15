const express = require("express");
const zlib = require("zlib");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require("cors");


app.use(cors());

app.get("/api/stream/:fileName", async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = path.join(__dirname, "../Data/", fileName);

        // Check if the file exists
        const stats = await fs.stat(filePath);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const compressedData = zlib.deflateSync(fileContent);

        res.set({
            "Content-Encoding": "deflate",
            "Content-Type": "application/json",
            "Content-Length": compressedData.length,
        });
        res.send(compressedData);

    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
