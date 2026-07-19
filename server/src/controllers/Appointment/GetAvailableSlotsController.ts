import type { FastifyRequest, FastifyReply } from "fastify";
import { GetAvailableSlotsService } from "../../services/Appointment/GetAvailableSlotsService.js";

interface QueryParams {
  date: string;
  barberId: string;
}

class GetAvailableSlotsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { date, barberId } = request.query as QueryParams;

    if(!date){
        throw new Error("A data é necessária (YYYY-MM-DD)");
    }

    if(!barberId){
        throw new Error("Informe o barberId nos query parameters");
    }

    const getAvailableSlotsService = new GetAvailableSlotsService();

    try {
      const slots = await getAvailableSlotsService.execute({ date, barberId });
      return reply.status(200).send(slots);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}

export { GetAvailableSlotsController };
