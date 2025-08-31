import express from "express";
import dotenv from "dotenv";
import webhookRouter from "./routes/webhook.router.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/webhook", webhookRouter);
app.listen(port, () => {
    console.log(`---- Server is Running ----`);
});
//# sourceMappingURL=index.js.map