import prismaClient from "../../prisma/index.js";

interface ServiceProps {
  name: string;
  price: number;
  duration: number;
}

class CreateServiceService {
  async execute({ name, price, duration }: ServiceProps) {
    // Verifica se os dados obrigatorios chegaram corretamente
    if (!name || !price || !duration) {
      throw new Error("Campos obrigatorios nao preenchidos");
    }

    // Salva o novo servico no banco de dados usando o Prisma
    const service = await prismaClient.service.create({
      data: {
        name,
        price: Number(price),
        duration: Number(duration),
      },
    });

    return service;
  }
}

export { CreateServiceService };
