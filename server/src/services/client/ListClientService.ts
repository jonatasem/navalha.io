import prismaClient from "../../prisma/index.js";

export class ListClientService {
  async execute() {
    const clients = await prismaClient.client.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return clients;
  }
}
