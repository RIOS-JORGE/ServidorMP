import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";
// Agrega credenciales

const client = new MercadoPagoConfig({
  accessToken: process.env.VITE_APP_ACCESSTOKEN,
});
console.log(process.env.VITE_APP_ACCESSTOKEN);
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("*", (req, res) => {
  res.send("soy el server");
});

app.post("/create_preference", async (req, res) => {
  try {
    let body = {
      items: [
        {
          title: req.body.description,
          unit_price: Number(req.body.price),
          quantity: Number(req.body.quantity),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: "http://localhost:8080/feedback",
        failure: "http://localhost:8080/feedback",
        pending: "http://localhost:8080/feedback",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    res.json({
      id: result.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al crear la Preferencia",
    });
  }
});

app.listen(port, () => {
  console.log(`El servidor esta corriendo en http://localhost:${port}`);
});
