import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import receiptRoutes from "./routes/receiptRoutes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.use("/api/receipts", receiptRoutes);

app.get("/", (req, res) => {
  res.send("Receipt Parser API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});