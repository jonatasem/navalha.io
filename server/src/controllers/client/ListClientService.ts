import type { FastifyRequest, FastifyReply } from "fastify";
import { ListClientService } from "../../services/client/ListClientService.js";

export class ListClientController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listClientService = new ListClientService();

    try {
      const clients = await listClientService.execute();
      return reply.status(200).send(clients);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}
