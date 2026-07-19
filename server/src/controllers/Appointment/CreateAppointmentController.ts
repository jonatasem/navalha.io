import type { FastifyRequest, FastifyReply } from "fastify";
import { CreateAppointmentService } from "../../services/Appointment/CreateAppointmentService.js";

interface ListAppointmentProps {
  clientId: string;
  barberId: string;
  serviceId: string;
  date: string;
}

export class CreateAppointmentController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { clientId, barberId, serviceId, date } =
      request.body as ListAppointmentProps;
    const createAppointmentService = new CreateAppointmentService();

    try {
      const appointment = await createAppointmentService.execute({
        clientId,
        barberId,
        serviceId,
        date,
      });

      return reply.status(201).send(appointment);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}
