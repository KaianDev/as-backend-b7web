import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import https from "https";
import fs from "fs";
import siteRoutes from "./routes/site";
import adminRoutes from "./routes/admin";
import { requestIntercept } from "./utils/requestIntercept";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("*", requestIntercept);

app.use("/admin", adminRoutes);
app.use("/", siteRoutes);

const runServer = (port: number, server: http.Server) => {
    server.listen(port, () => console.log(`🚀 Running at PORT ${port}`));
};

const regularServer = http.createServer(app);

if (process.env.NODE_ENV === "production") {
    // TODO: Configurar SSL
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY as string),
        cert: fs.readFileSync(process.env.SSL_CERT as string),
    };
    
    // TODO: rodar server na porta 80 e na 443 (80 http e 443 https)
    const secServer = https.createServer(options, app);
    runServer(80, regularServer);
    runServer(443, secServer);
} else {
    const serverPort: number = process.env.PORT
        ? parseInt(process.env.PORT)
        : 9000;
    runServer(serverPort, regularServer);
}
