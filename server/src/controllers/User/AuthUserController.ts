import type { FastifyRequest, FastifyReply } from "fastify";
import { AuthUserService } from "../../services/User/AuthUserService.js";

interface AuthUserProps {
  email: string;
  password: string;
}

class AuthUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    // Pega os dados de acesso do corpo da requisicao
    const { email, password } = request.body as AuthUserProps;

    // Salva a funcao do service em uma variavel
    const authUserService = new AuthUserService();

    try {
      // Executa a funcao do service
      const session = await authUserService.execute({ email, password });

      // Retorna o login
      return reply.status(200).send(session);
    } catch (error: any) {
      // retorna um erro se nao conseguir fazer login
      return reply.status(400).send({ error: error.message });
    }
  }
}

export { AuthUserController };
