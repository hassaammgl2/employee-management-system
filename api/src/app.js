import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ENVS } from "./utils/constants.js";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import departmentRoutes from "./routes/department.routes.js";

const app = express();

// CORS configuration - must be before other middleware
const allowedOrigins = [
	ENVS.CLIENT_ORIGIN || "http://localhost:5173",
	"http://localhost:5173",
	"http://127.0.0.1:5173",
];

app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like mobile apps, Postman, or same-origin)
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
		exposedHeaders: ["Set-Cookie"],
		optionsSuccessStatus: 200,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));

// CORS middleware already handles OPTIONS preflight requests automatically

app.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Hello World",
	});
});
// auth routes
app.use("/api", authRoutes);

// employee routes
app.use("/api/employees", employeeRoutes);

// department routes
app.use("/api/departments", departmentRoutes);

// error handlers
app.use(errorHandler);

app.use((req, res, next) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

export default app;
