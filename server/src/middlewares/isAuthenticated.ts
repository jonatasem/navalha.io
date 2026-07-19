import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

interface TokenPayload {
  sub: string;
}

// Extende o tipo do FastifyRequest para aceitar o userId injetado
declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
}

export async function isAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Recebe o token enviado no cabecalho da requisicao
  const authHeader = request.headers.authorization;

  // Se nao existir token, barra a requisicao na hora
  if (!authHeader) {
    return reply.status(401).send({ error: "Token nao enviado" });
  }

  // Divide o cabecalho para isolar a string do token
  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new Error("Token invalido");
  }

  try {
    // Valida o token com a chave secreta do .env
    const { sub } = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenPayload;

    // Injeta o ID do usuario dentro da requisicao para uso posterior
    request.userId = sub;
  } catch (err) {
    // Se der erro na verificacao, o token e invalido ou expirou
    return reply.status(401).send({ error: "Token invalido" });
  }
}
