import fastify from "fastify";
import cors from "@fastify/cors";
import { routes } from "./routes/index.js";
import { whatsAppProvider } from "./providers/WhatsAppProvider.js";

const app = fastify({ logger: false });

const start = async () => {
  await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.register(routes);

  try {
    const port = Number(process.env.PORT) || 3333;

    await app.listen({
      port,
      host: "0.0.0.0",
    });

    console.log(`Navalha.io está online na porta ${port}`);

    // Inicializa a conexão do WhatsApp
    await whatsAppProvider.initialize();
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();