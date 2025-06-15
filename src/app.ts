import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import {
  authRoutes,
  adminRoutes,
  sessionRoutes,
  bookingRoutes,
  reviewRoutes,
  noteRoutes,
  materialRoutes,
  courseRoutes,
} from "./routes";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL as string],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/materials", materialRoutes);

app.use(/(.*)/, (_req: Request, _res: Response, next: NextFunction) => {
  next(createHttpError(404, "endpoints not found"));
});

// Error handler
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let errorStatus = 500;
  let errorMessage = "Unknown error has occurred";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let errorDetails: any = null;

  if (isHttpError(error)) {
    errorStatus = error.status;
    errorMessage = error.message;

    // Capture any custom `errors` property (e.g., from validation)
    if ("errors" in error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errorDetails = (error as any).errors;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  console.error(`[ERROR ${errorStatus}]`, errorMessage);

  res.status(errorStatus).json({
    message: errorMessage,
    success: false,
    errors: errorDetails,
  });
});

export default app;
