import type {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";

import { isAuthenticated } from "../middlewares/isAuthenticated.js";

// User Controllers
import { CreateUserController } from "../controllers/User/CreateUserController.js";
import { AuthUserController } from "../controllers/User/AuthUserController.js";

// Service Controllers
import { CreateServiceController } from "../controllers/Service/CreateServiceController.js";
import { ListServiceController } from "../controllers/Service/ListServiceController.js";

// Client Controllers
import { CreateClientController } from "../controllers/client/CreateClienteController.js";
import { ListClientController } from "../controllers/client/ListClientService.js";

// Appointment Controllers
import { CreateAppointmentController } from "../controllers/Appointment/CreateAppointmentController.js";
import { ListAppointmentController } from "../controllers/Appointment/ListAppointmentController.js";
import { GetAvailableSlotsController } from "../controllers/Appointment/GetAvailableSlotsController.js";
import { FinishAppointmentController } from "../controllers/Appointment/FinishAppointmentController.js";

// Dashboard Controller
import { GetDashboardMetricsController } from "../controllers/Dashboard/GetDashboardMetricsController.js";

export async function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) {
  // PÚBLICAS

  // Cadastrar barbeiro/admin
  fastify.post(
    "/user",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new CreateUserController().handle(request, reply);
    },
  );

  // Autenticação / Login
  fastify.post(
    "/login",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new AuthUserController().handle(request, reply);
    },
  );

  // Listar serviços disponíveis (público para clientes consultarem)
  fastify.get(
    "/services",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new ListServiceController().handle(request, reply);
    },
  );

  // ROTAS PRIVADAS

  // --- SERVIÇOS ---
  fastify.post(
    "/service",
    { preHandler: [isAuthenticated] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new CreateServiceController().handle(request, reply);
    },
  );

  // --- CLIENTES ---
  fastify.post(
    "/client",
    { preHandler: [isAuthenticated] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new CreateClientController().handle(request, reply);
    },
  );

  fastify.get(
    "/clients",
    { preHandler: [isAuthenticated] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new ListClientController().handle(request, reply);
    },
  );

  // --- AGENDAMENTOS ---
  // Criar um novo agendamento
  fastify.post(
    "/appointment",
    { preHandler: [isAuthenticated] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new CreateAppointmentController().handle(request, reply);
    },
  );

  // Listar todos os agendamentos
  fastify.get(
    "/appointments",
    { preHandler: [isAuthenticated] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new ListAppointmentController().handle(request, reply);
    },
  );

  // Buscar horários livres/ocupados dinamicamente para uma data
  fastify.get(
    "/appointments/slots",
    { preHandler: [isAuthenticated] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new GetAvailableSlotsController().handle(request, reply);
    },
  );

  // Concluir serviço (baixa no pacote do cliente e atualização do total gasto)
  fastify.patch(
    "/appointment/:id/finish",
    { preHandler: [isAuthenticated] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new FinishAppointmentController().handle(request, reply);
    },
  );

  // --- DASHBOARD & CRM ---
  // Métricas do barbeiro (Faturamento, Clientes VIP e Inativos)
  fastify.get(
    "/dashboard/metrics",
    { preHandler: [isAuthenticated] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new GetDashboardMetricsController().handle(request, reply);
    },
  );
}
