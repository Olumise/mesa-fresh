import "dotenv/config";
import express from "express";
const app = express();
const PORT = process.env.PORT;
import { ErrorHandler } from "./middlewares/errorHandler.js";
import locationRouter from "./routes/location.js";
import menuRouter from "./routes/menu.js";

app.use(express.json());

app.use("/api/location", locationRouter);
app.use("/api/menu", menuRouter);

app.use(ErrorHandler);
app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});
