import './db/index.db';
import 'express-async-errors';
import express from "express"
import authRouter from "./routes/auth.routes";
import { errorHandler } from './middlewares/error.middlewares';
import cookieParser from 'cookie-parser';
import authorRouter from './routes/author.routes';

const PORT = process.env.PORT || 5050
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use("/auth",authRouter);
app.use("/author",authorRouter);
app.use(errorHandler);
app.listen(PORT, ()=> {
  console.log(`The application server is running on port http://localhost:${PORT}`)
});
