import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState, type
  WASocket,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import pino from "pino";

class WhatsAppProvider {
  private socket: WASocket | null = null;
  private ready: boolean = false;

  public async initialize(): Promise<void> {
    // Armazena as credenciais da sessão na pasta local auth_info_baileys
    const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

    this.socket = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: "silent" }), // Silencia os logs internos do Baileys
    });

    // Salva as credenciais sempre que a sessão atualizar
    this.socket.ev.on("creds.update", saveCreds);

    // Gerencia as conexões e desconexões
    this.socket.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update;

      // Exibe o QR Code no terminal quando gerado
      if (qr) {
        console.log("\n================ Escaneie o QR Code ================\n");
        qrcode.generate(qr, { small: true });
      }

      if (connection === "close") {
        this.ready = false;
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        console.log(
          `Conexão do WhatsApp fechada (código: ${statusCode}). Reconectando?: ${shouldReconnect}`
        );

        if (shouldReconnect) {
          this.initialize();
        }
      } else if (connection === "open") {
        this.ready = true;
        console.log("⚡ WhatsAppProvider conectado com sucesso!");
      }
    });
  }

  /**
   * Envia uma mensagem de texto simples para um número
   * @param to Número de telefone com DDD (ex: "5511999999999")
   * @param message Texto da mensagem
   */
  public async sendTextMessage(to: string, message: string): Promise<void> {
    if (!this.socket || !this.ready) {
      throw new Error("Serviço do WhatsApp ainda não está pronto/conectado.");
    }

    // Formata o número para o padrão JID do WhatsApp (ex: 5511999999999@s.whatsapp.net)
    const formattedJid = to.includes("@s.whatsapp.net")
      ? to
      : `${to.replace(/\D/g, "")}@s.whatsapp.net`;

    await this.socket.sendMessage(formattedJid, { text: message });
  }

  /**
   * Retorna o status atual da conexão
   */
  public isConnected(): boolean {
    return this.ready;
  }
}

// Exporta uma única instância (Singleton) para ser usada na aplicação inteira
export const whatsAppProvider = new WhatsAppProvider();