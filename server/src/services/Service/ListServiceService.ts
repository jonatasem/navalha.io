import prismaClient from "../../prisma/index.js";

export class ListServiceService {
  async execute() {
    // Busca todos os servicos cadastrados no banco de dados
    const services = await prismaClient.service.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Retorna os servicos cadastrados
    return services;
  }
}
