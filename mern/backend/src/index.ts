import './db/index.db';
import express from "express"
import authRouter from "./routes/auth.routes";

const PORT = process.env.PORT || 5050
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/auth",authRouter);
app.listen(PORT, ()=> {
  console.log(`The application server is running on port http://localhost:${PORT}`)
});
