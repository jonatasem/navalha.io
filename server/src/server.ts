import fastify from "fastify";
import { routes } from "./routes/index.js";
import cors from "@fastify/cors";

// Desativando os logs
const app = fastify({
  logger: false,
});

const start = async () => {
  await app.register(cors, {
    origin: "*", //temporário
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.register(routes);

  try {
    await app.listen({
      port: 3333,
      host: "0.0.0.0", //temporário
    });
    console.log("Navalha.io está online na porta 3333");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
