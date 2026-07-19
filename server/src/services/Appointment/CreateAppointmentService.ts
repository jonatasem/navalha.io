import prismaClient from "../../prisma/index.js";

interface CreateAppointmentProps {
  clientId: string;
  barberId: string;
  serviceId: string;
  date: string | Date;
}

export class CreateAppointmentService {
  async execute({
    clientId,
    barberId,
    serviceId,
    date,
  }: CreateAppointmentProps) {
    if (!clientId || !barberId || !serviceId || !date) {
      throw new Error("Preencha todos os campos para criar o agendamento");
    }

    const appointment = await prismaClient.appointment.create({
      data: {
        clientId,
        barberId,
        serviceId,
        date: new Date(date),
      },
      include: {
        client: true,
        service: true,
        barber: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return appointment;
  }
}
