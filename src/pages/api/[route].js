import { promises as fs } from "fs";
import path from "path";
import zlib from "zlib";

// This needs to be secured

export default async function handler(req, res) {
    try {
        const route = req.query.route;
        console.log('Handling request for route:', route);
        // const fileName = req.query.fileName;
        const filePath = path.join(process.cwd(), "Data", route);

        // const stats = await fs.stat(filePath);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const compressedData = zlib.deflateSync(fileContent);

        res.setHeader("Content-Encoding", "deflate");
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Length", compressedData.length.toString());
        res.status(200).send(compressedData);
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).send("Internal Server Error");
    }
}
