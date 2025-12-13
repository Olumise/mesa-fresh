import "dotenv/config";
import express from "express";
const app = express();
const PORT = process.env.PORT;
import { ErrorHandler } from "./middlewares/errorHandler.js";

app.use(express.json());

app.use(ErrorHandler);
app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});
