import prismaClient from "../../prisma/index.js";

interface SlotsRequest {
  date: string;
  barberId: string;
}

class GetAvailableSlotsService {
  async execute({ date, barberId }: SlotsRequest) {
    // Garante que a string de data é válida
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    if (isNaN(startDate.getTime())) {
      throw new Error("Formato de data inválido. Use AAAA-MM-DD.");
    }

    const openingTime = 8;
    const closingTime = 18;
    const slotDurationMinutes = 45;

    // Busca agendamentos do dia no MongoDB
    const busyAppointments = await prismaClient.appointment.findMany({
      where: {
        barberId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        status: { not: "CANCELADO" },
      },
      select: { date: true },
    });

    const busyTimes = busyAppointments.map((app) => {
      const d = new Date(app.date);
      return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
    });

    const slots = [];
    let currentTime = new Date(
      `${date}T${String(openingTime).padStart(2, "0")}:00:00.000Z`,
    );
    const endTime = new Date(
      `${date}T${String(closingTime).padStart(2, "0")}:00:00.000Z`,
    );

    while (currentTime < endTime) {
      const timeString = `${String(currentTime.getUTCHours()).padStart(2, "0")}:${String(currentTime.getUTCMinutes()).padStart(2, "0")}`;

      slots.push({
        time: timeString,
        available: !busyTimes.includes(timeString),
      });

      currentTime.setMinutes(currentTime.getMinutes() + slotDurationMinutes);
    }

    return slots;
  }
}

export { GetAvailableSlotsService };
