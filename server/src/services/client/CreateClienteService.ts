import prismaClient from "../../prisma/index.js";

interface CreateClienteProps {
  name: string;
  phone: string;
}

export class CreateClientService {
  async execute({ name, phone }: CreateClienteProps) {
    if (!name || !phone) {
      throw new Error("Nome e telefone sao obrigatorios");
    }

    // Verifica se ja existe um cliente com o mesmo telefone
    const clientAlreadyExists = await prismaClient.client.findFirst({
      where: { phone },
    });

    if (clientAlreadyExists) {
      throw new Error("Cliente ja cadastrado com este telefone");
    }

    const client = await prismaClient.client.create({
      data: {
        name,
        phone,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        totalGasto: true,
      },
    });

    return client;
  }
}
