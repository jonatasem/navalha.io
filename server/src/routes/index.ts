import type {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { CreateUserController } from "../controllers/User/CreateUserController.js";
import { AuthUserController } from "../controllers/User/AuthUserController.js";
import { CreateServiceController } from "../controllers/Service/CreateServiceController.js";
import { ListServiceController } from "../controllers/Service/ListServiceController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js"; // Importa o middleware de seguranca

export async function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) {
  -fastify.post(
    "/user",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new CreateUserController().handle(request, reply);
    },
  );

  fastify.post(
    "/login",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new AuthUserController().handle(request, reply);
    },
  );

  fastify.post(
    "/service",
    { preHandler: [isAuthenticated] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new CreateServiceController().handle(request, reply);
    },
  );

  fastify.get(
    "/services",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new ListServiceController().handle(request, reply);
    },
  );
}
