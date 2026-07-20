import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";

class WhatsAppProvider {
  private client: any;
  private isReady: boolean = false;

  constructor() {
    this.client = new Client({

      // Salva os dados do login na pasta .wwebjs_auth
      authStrategy: new LocalAuth({ clientId: "navalha-bot" }),
      puppeteer: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
        ],
      },
    });

    this.initializeEvents();
  }

  private initializeEvents() {
    // Exibe o QR Code no terminal se precisar autenticar
    this.client.on("qr", (qr: string) => {
      console.log("\nEscaneie o QR Code abaixo para conectar:");
      qrcode.generate(qr, { small: true });
    });

    // Avisa no console quando o WhatsApp estiver pronto para uso
    this.client.on("ready", () => {
      console.log("Conectado e pronto para enviar mensagens!");
      this.isReady = true;
    });

    this.client.on("auth_failure", (message: string) => {
      console.error("Falha na autenticação:", message);
    });

    this.client.on("disconnected", (reason: string) => {
      console.log("Desconectado:", reason);
      this.isReady = false;
    });

    this.client.initialize();
  }

  /**
   * Envia uma mensagem para o numero informado
   * @param phone Número do telefone do cliente
   * @param message Texto da mensagem
   */
  async sendMessage(phone: string, message: string) {
    if (!this.isReady) {
      console.log(
        "Tentativa de envio ignorada: WhatsApp ainda não está pronto."
      );
      return;
    }

    try {
      // Limpa caracteres especiais do numero
      const cleanPhone = phone.replace(/\D/g, "");

      // Garante o código do Brasil (55) no início do número
      const formattedPhone = cleanPhone.startsWith("55")
        ? cleanPhone
        : `55${cleanPhone}`;

      // Formato exigido pelo whatsapp-web.js
      const chatId = `${formattedPhone}@c.us`;

      await this.client.sendMessage(chatId, message);
      console.log(`✉️ [Confirmação enviada para +${formattedPhone}]`);
    } catch (error) {
      console.error("Erro ao disparar mensagem:", error);
    }
  }
}

// Exporta uma instância unica
export const whatsAppProvider = new WhatsAppProvider();
