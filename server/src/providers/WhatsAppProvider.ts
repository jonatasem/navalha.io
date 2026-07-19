export class WhatsAppProvider {
  static async sendTextMessage(phone: string, text: string) {
    try {
      // Exemplo de integração com gateway HTTP de WhatsApp (Evolution API / Z-API)
      /*
      await fetch("http://localhost:8080/message/sendText/corvelloni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.WHATSAPP_API_KEY || "",
        },
        body: JSON.stringify({
          number: `55${phone}`,
          text: text,
        }),
      });
      */
      console.log(`[WHATSAPP ENVIADO PARA ${phone}]: ${text}`);
    } catch (error) {
      console.error("Erro ao enviar mensagem no WhatsApp:", error);
    }
  }
}