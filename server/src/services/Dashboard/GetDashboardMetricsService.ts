import prismaClient from "../../prisma/index.js";

class GetDashboardMetricsService {
  async execute() {
    // Clientes VIP (Quem mais gasta)
    const topClients = await prismaClient.client.findMany({
      take: 5,
      orderBy: { totalGasto: "desc" },
      select: { id: true, name: true, phone: true, totalGasto: true },
    });

    // Agendamentos concluídos nos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAppointments = await prismaClient.appointment.findMany({
      where: {
        status: "CONCLUIDO",
        created_at: { gte: thirtyDaysAgo },
      },
      include: { service: true },
    });

    // Faturamento dos últimos 30 dias
    const monthlyRevenue = recentAppointments.reduce((acc, item) => acc + item.service.price, 0);

    // Alerta de Inatividade: Clientes que não agendam há mais de 25 dias
    const allClients = await prismaClient.client.findMany({
      include: {
        appointments: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
    });

    const twentyFiveDaysAgo = new Date();
    twentyFiveDaysAgo.setDate(twentyFiveDaysAgo.getDate() - 25);

    const inactiveClients = allClients.filter((client) => {
      const lastApp = client.appointments[0];
      return !lastApp || new Date(lastApp.date) < twentyFiveDaysAgo;
    });

    return {
      monthlyRevenue,
      totalAppointmentsMonth: recentAppointments.length,
      topClients,
      inactiveClientsCount: inactiveClients.length,
      inactiveClientsList: inactiveClients.map((c) => ({ id: c.id, name: c.name, phone: c.phone })),
    };
  }
}

export { GetDashboardMetricsService };