import type { FastifyRequest, FastifyReply } from "fastify";
import { FinishAppointmentService } from "../../services/Appointment/FinishAppointmentService.js";

interface Params {
  id: string;
}

class FinishAppointmentController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as Params;
    const finishAppointmentService = new FinishAppointmentService();

    try {
      const appointment = await finishAppointmentService.execute({ appointmentId: id });
      return reply.status(200).send(appointment);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}

export { FinishAppointmentController };
