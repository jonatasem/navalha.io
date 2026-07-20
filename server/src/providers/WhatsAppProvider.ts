import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  type WASocket,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";

class WhatsAppProvider {
  private socket: WASocket | null = null;
  private ready: boolean = false;

  public async initialize(): Promise<void> {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

    // Defina se quer usar Código de Pareamento em vez de QR Code
    const usePairingCode = true; 
    // Coloque o número do WhatsApp da barbearia (com DDD e 55, sem espaços ou hífen)
    const phoneNumber = "5518997215026"; 

    this.socket = makeWASocket({
      auth: state,
      printQRInTerminal: !usePairingCode, // Desativa QR Code se for usar código
      logger: pino({ level: "silent" }),
    });

    // Se não estiver registrado e optar por código de pareamento
    if (usePairingCode && !this.socket.authState.creds.registered) {
      setTimeout(async () => {
        if (this.socket) {
          const code = await this.socket.requestPairingCode(phoneNumber);
          console.log("\n========================================");
          console.log(`🔑 CÓDIGO DE PAREAMENTO DO WHATSAPP: ${code}`);
          console.log("========================================\n");
        }
      }, 3000);
    }

    this.socket.ev.on("creds.update", saveCreds);

    this.socket.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "close") {
        this.ready = false;
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          this.initialize();
        }
      } else if (connection === "open") {
        this.ready = true;
        console.log("⚡ WhatsAppProvider conectado com sucesso!");
      }
    });
  }

  public async sendMessage(to: string, message: string): Promise<void> {
    if (!this.socket || !this.ready) {
      console.warn("⚠️ WhatsApp não está conectado.");
      return;
    }

    const formattedJid = to.includes("@s.whatsapp.net")
      ? to
      : `${to.replace(/\D/g, "")}@s.whatsapp.net`;

    await this.socket.sendMessage(formattedJid, { text: message });
  }

  public isConnected(): boolean {
    return this.ready;
  }
}

export const whatsAppProvider = new WhatsAppProvider();