import type { FastifyRequest, FastifyReply } from "fastify";
import { ListServiceService } from "../../services/Service/ListServiceService.js";

export class ListServiceController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listServiceService = new ListServiceService();

    try {
      // Executa a busca de servicos no banco
      const services = await listServiceService.execute();

      // Retorna a lista obtida com codigo HTTP 200 (OK)
      return reply.status(200).send(services);
    } catch (error: any) {
      // Retorna a mensagem de erro caso ocorra alguma falha
      return reply.status(400).send({ error: error.message });
    }
  }
}
