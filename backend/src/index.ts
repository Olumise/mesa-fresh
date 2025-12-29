import "dotenv/config";
import express from "express";
const app = express();
const PORT = process.env.PORT;
import { ErrorHandler } from "./middlewares/errorHandler.js";
import locationRouter from "./routes/location.js";
import menuRouter from "./routes/menu.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../src/lib/auth.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import staffRouter from "./routes/staff.js";
import uploadRouter from "./routes/upload.js";
import orderRouter from "./routes/order.js";

// app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/location", locationRouter);
app.use("/api/menu", menuRouter);
app.use("/api/admin", adminRouter);
app.use("/api/profile", profileRouter);
app.use("/api/staff", staffRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/order", orderRouter);

app.use(ErrorHandler);
app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});
