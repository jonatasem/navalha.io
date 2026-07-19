import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

// User Controllers
import { AuthUserController } from "../controllers/User/AuthUserController.js";
import { CreateUserController } from "../controllers/User/CreateUserController.js";

export async function routes(fastify: FastifyInstance) {

  // Login do Admin
  fastify.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    return new AuthUserController().handle(request, reply);
  });

  fastify.post("/user", async (request:FastifyRequest, reply: FastifyReply) => {
    return new CreateUserController().handle(request, reply);
  });

}
