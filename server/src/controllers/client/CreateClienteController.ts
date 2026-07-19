import type { FastifyRequest, FastifyReply } from "fastify";
import { CreateClientService } from "../../services/client/CreateClienteService.js";

interface CreateClientBody {
  name: string;
  phone: string;
}

export class CreateClientController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, phone } = request.body as CreateClientBody;
    const createClientService = new CreateClientService();

    try {
      const client = await createClientService.execute({ name, phone });
      return reply.status(201).send(client);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}
