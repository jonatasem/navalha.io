import type { FastifyRequest, FastifyReply } from "fastify";
import { ListAppointmentService } from "../../services/Appointment/ListAppointmentService.js";

export class ListAppointmentController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listAppointmentService = new ListAppointmentService();

    try {
      const appointments = await listAppointmentService.execute();
      return reply.status(200).send(appointments);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}
