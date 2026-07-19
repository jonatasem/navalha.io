import prismaClient from "../../prisma/index.js";

export class ListAppointmentService {
  async execute() {
    const appointments = await prismaClient.appointment.findMany({
      orderBy: {
        date: "asc",
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

    return appointments;
  }
}
