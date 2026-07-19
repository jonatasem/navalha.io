import prismaClient from "../../prisma/index.js";

interface FinishAppointmentProps {
  appointmentId: string;
}

class FinishAppointmentService {
  async execute({ appointmentId }: FinishAppointmentProps) {
    // Busca o agendamento
    const appointment = await prismaClient.appointment.findUnique({
      where: { id: appointmentId },
      include: { service: true, client: true },
    });

    if (!appointment) throw new Error("Agendamento não encontrado");

    // Procura pacote ativo do cliente
    const activePackage = await prismaClient.clientPackage.findFirst({
      where: {
        clientId: appointment.clientId,
        validade: { gte: new Date() },
      },
    });

    // Verifica e abata do pacote (Se houver saldo)
    if (activePackage) {
      const isHaircut = appointment.service.name.toLowerCase().includes("corte");
      const isBeard = appointment.service.name.toLowerCase().includes("barba");

      if (isHaircut && activePackage.cortesRestantes > 0) {
        await prismaClient.clientPackage.update({
          where: { id: activePackage.id },
          data: { cortesRestantes: { decrement: 1 } },
        });
      } else if (isBeard && activePackage.barbasRestantes > 0) {
        await prismaClient.clientPackage.update({
          where: { id: activePackage.id },
          data: { barbasRestantes: { decrement: 1 } },
        });
      }
    }

    // Atualiza o valor total gasto pelo cliente no cadastro e finaliza o agendamento
    await prismaClient.client.update({
      where: { id: appointment.clientId },
      data: { totalGasto: { increment: appointment.service.price } },
    });

    const updatedAppointment = await prismaClient.appointment.update({
      where: { id: appointmentId },
      data: { status: "CONCLUIDO" },
    });

    return updatedAppointment;
  }
}

export { FinishAppointmentService };
