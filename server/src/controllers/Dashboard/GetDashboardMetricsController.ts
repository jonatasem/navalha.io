import type { FastifyRequest, FastifyReply } from "fastify";
import { GetDashboardMetricsService } from "../../services/Dashboard/GetDashboardMetricsService.js";

class GetDashboardMetricsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const getDashboardMetricsService = new GetDashboardMetricsService();

    try {
      const metrics = await getDashboardMetricsService.execute();
      return reply.status(200).send(metrics);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}

export { GetDashboardMetricsController };