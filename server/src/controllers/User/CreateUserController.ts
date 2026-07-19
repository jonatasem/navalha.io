import type { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserService } from "../../services/User/CreateUserService.js";

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

class CreateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    // Pega todos os dados no corpo da requisicao
    const { name, email, password } = request.body as CreateUserProps;

    // Armazena a funcao do service
    const createUserService = new CreateUserService();

    try {
      // Tenta cadastrar no banco de dados
      const user = await createUserService.execute({ name, email, password });

      // Retorna o usuario cadastrado
      return reply.status(201).send(user);
    } catch (error: any) {
      // Retorna um erro
      return reply.status(400).send({ error: error.message });
    }
  }
}

export { CreateUserController };
