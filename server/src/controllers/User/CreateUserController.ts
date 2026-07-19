import type { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserService } from "../../services/User/CreateUserService.js";

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

class CreateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password } = request.body as CreateUserProps;

    const createUserService = new CreateUserService();

    try {
      const user = await createUserService.execute({ name, email, password });
      return reply.status(201).send(user);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}

export { CreateUserController };