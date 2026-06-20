import dotenv from "dotenv";
import express from "express";
import { conectarBanco } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import cardapioRoutes from "./routes/cardapio.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cardapios", cardapioRoutes);

async function iniciarServidor() {
  await conectarBanco();

  app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
  });
}

iniciarServidor();
