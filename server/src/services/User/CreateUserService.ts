import prismaClient from "../../prisma/index.js";
import { hash } from "bcryptjs";

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

export class CreateUserService {
  async execute({ name, email, password }: CreateUserProps) {
    
    // Se os dados nao forem enviados, retorne erro
    if (!name || !email || !password) {
      throw new Error("Todos os campos são obrigatórios");
    }

    // Verifica se ja existe um usuário com o mesmo e-mail
    const userAlreadyExists = await prismaClient.user.findUnique({
      where: { email },
    });

    // Se existir, retorne um erro
    if (userAlreadyExists) {
      throw new Error(
        "Este e-mail já está em uso por outro usuário administrativo",
      );
    }

    // Gera o hash seguro da senha
    const passwordHash = await hash(password, 8);

    // Salva o usuario no banco de dados
    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: "ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    return user;
  }
}
