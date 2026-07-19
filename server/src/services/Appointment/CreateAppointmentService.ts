import prismaClient from "../../prisma/index.js";
import { whatsAppProvider } from "../../providers/WhatsappProvider.js";

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
            phone: true,
            role: true,
          },
        },
      },
    });

    const appointmentDate = new Date(appointment.date);
    const formattedDate = appointmentDate.toLocaleDateString("pt-BR");
    const formattedTime = appointmentDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // MENSAGEM PARA O ADMIN 
    if (appointment.barber?.phone) {
      const barberMessage =
        `🔔 *Novo Agendamento Pendente!*\n\n` +
        `Olá *${appointment.barber.name}*, um novo agendamento foi solicitado no site:\n\n` +
        `👤 *Cliente:* ${appointment.client.name}\n` +
        `💈 *Serviço:* ${appointment.service.name}\n` +
        `📅 *Data:* ${formattedDate}\n` +
        `⏰ *Horário:* ${formattedTime}\n\n` +
        `Acesse o painel para confirmar ou gerenciar:\n` +
        `http://localhost:5173/dashboard`;

      whatsAppProvider.sendMessage(appointment.barber.phone, barberMessage);
    }
    
    return appointment;
  }
}
