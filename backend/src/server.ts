import express from "express";
import cors from "cors";
import { config } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app: express.Application = express();

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
 Server is running!
 Port: ${PORT}
 API: http://localhost:${PORT}/api
  `);
});

export default app;
