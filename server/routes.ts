import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { Resend } from "resend";
import { contactFormSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
    files: 5, // max 5 files
  },
  fileFilter: (_req: any, file: any, cb: any) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Nur Bilddateien (JPEG, PNG, GIF, WebP) sind erlaubt'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  const resend = new Resend(process.env.RESEND_API_KEY);

  app.post("/api/contact", upload.array('images', 5), async (req, res) => {
    try {
      // Validate form data
      const result = contactFormSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          message: validationError.message 
        });
      }

      const { name, email, phone, message, honeypot } = result.data;

      // Honeypot check - if filled, it's likely a bot
      if (honeypot) {
        return res.status(200).json({ 
          message: "Nachricht gesendet" 
        });
      }

      // Prepare attachments from uploaded files
      const files = (req as any).files as Array<{originalname: string, buffer: Buffer}> || [];
      const attachments = files.map(file => ({
        filename: file.originalname,
        content: file.buffer,
      }));

      // Build email content
      let emailHtml = `
        <h2>Neue Kontaktanfrage von der Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
        <p><strong>Nachricht:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `;

      if (attachments.length > 0) {
        emailHtml += `<p><strong>Anhänge:</strong> ${attachments.length} Bild(er)</p>`;
      }

      // Send email via Resend
      const { data, error } = await resend.emails.send({
        from: 'Kontaktformular <onboarding@resend.dev>',
        to: 'info@rex-bedachung.de',
        replyTo: email,
        subject: `Neue Kontaktanfrage von ${name}`,
        html: emailHtml,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      if (error) {
        console.error('Resend error:', error);
        return res.status(500).json({ 
          message: 'Fehler beim Senden der E-Mail. Bitte versuchen Sie es später erneut.' 
        });
      }

      res.status(200).json({ 
        message: 'Nachricht erfolgreich gesendet',
        id: data?.id 
      });

    } catch (error: any) {
      console.error('Contact form error:', error);
      res.status(500).json({ 
        message: error.message || 'Ein Fehler ist aufgetreten' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
