import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";

class WhatsAppProvider {
  private client: pkg.Client;
  private isReady: boolean = false;

  constructor() {
    this.client = new Client({
      // Salva os dados do login na pasta .wwebjs_auth para não pedir QR Code toda vez
      authStrategy: new LocalAuth({ clientId: "navalha-bot" }),
      puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    this.initializeEvents();
  }

  private initializeEvents() {
    // Exibe o QR Code no terminal se precisar autenticar
    this.client.on("qr", (qr) => {
      console.log("\n📱 [WhatsApp] Escaneie o QR Code abaixo para conectar:");
      qrcode.generate(qr, { small: true });
    });

    // Avisa no console quando o WhatsApp estiver pronto para uso
    this.client.on("ready", () => {
      console.log("✅ [WhatsApp Bot] Conectado e pronto para enviar mensagens!");
      this.isReady = true;
    });

    this.client.on("auth_failure", (message) => {
      console.error("❌ [WhatsApp Bot] Falha na autenticação:", message);
    });

    this.client.on("disconnected", (reason) => {
      console.log("⚠️ [WhatsApp Bot] Desconectado:", reason);
      this.isReady = false;
    });

    this.client.initialize();
  }

  /**
   * Envia uma mensagem para o número informado
   * @param phone Número do telefone do cliente (ex: "18997215026")
   * @param message Texto da mensagem
   */
  async sendMessage(phone: string, message: string) {
    if (!this.isReady) {
      console.log("⚠️ [WhatsApp] Tentativa de envio ignorada: WhatsApp ainda não está pronto.");
      return;
    }

    try {
      // Limpa caracteres especiais do número (espaços, traços, parênteses)
      const cleanPhone = phone.replace(/\D/g, "");

      // Garante o código do Brasil (55) no início do número
      const formattedPhone = cleanPhone.startsWith("55")
        ? cleanPhone
        : `55${cleanPhone}`;

      // O formato aceito pelo WhatsApp Web é "NUMERO@c.us"
      const chatId = `${formattedPhone}@c.us`;

      await this.client.sendMessage(chatId, message);
      console.log(`✉️ [WhatsApp] Confirmação enviada para +${formattedPhone}`);
    } catch (error) {
      console.error("❌ [WhatsApp] Erro ao disparar mensagem:", error);
    }
  }
}

// Exporta uma instância única (Singleton) para reutilizar a mesma conexão
export const whatsAppProvider = new WhatsAppProvider();