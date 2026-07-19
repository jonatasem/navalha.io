import prismaClient from "../../prisma/index.js";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

interface AuthUserProps {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: AuthUserProps) {
    
    // Verifica se os dados foram enviados
    if (!email || !password) {
      throw new Error("E-mail e senha são obrigatórios");
    }

    // Busca o usuario pelo e-mail
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    // Se não achar, retorna um erro
    if (!user) {
      throw new Error("E-mail ou senha incorretos");
    }

    // Compara a senha digitada com o hash salvo no banco
    const passwordMatch = await compare(password, user.password);

    // Se nao for valido, retorna um erro
    if (!passwordMatch) {
      throw new Error("E-mail ou senha incorretos");
    }

    // Gera o Token JWT valido por 8 horas
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: "8h",
      },
    );

    // Retorna os dados publicos do usuário logado + o token de acesso
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    };
  }
}

export { AuthUserService };
