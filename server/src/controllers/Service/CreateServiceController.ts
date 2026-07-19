import type { FastifyRequest, FastifyReply } from "fastify";
import { CreateServiceService } from "../../services/Service/CreateServiceService.js";

interface CreateServiceProps {
  name: string;
  price: number;
  duration: number;
}

class CreateServiceController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    // Captura os dados do corpo da requisicao
    const { name, price, duration } = request.body as CreateServiceProps;
    const createServiceService = new CreateServiceService();

    try {
      // Executa a regra de negocio de criacao
      const service = await createServiceService.execute({
        name,
        price,
        duration,
      });
      return reply.status(201).send(service);
    } catch (error: any) {
      // Retorna erro caso falte algo ou ocorra falha
      return reply.status(400).send({ error: error.message });
    }
  }
}

export { CreateServiceController };
