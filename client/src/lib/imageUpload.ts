/**
 * Foto des Typenschilds für die Preisrechner-Anfrage (P1).
 *
 * Das Foto wird vollständig im Browser vorbereitet, bevor es mit der Anfrage über
 * Netlify Forms gesendet wird:
 * - Drehung aus den Kameradaten übernehmen (`imageOrientation: "from-image"`),
 * - auf höchstens 2.000 px lange Kante verkleinern,
 * - neu als JPEG kodieren. Dabei entfallen alle eingebetteten Metadaten (EXIF, GPS),
 *   weil der Canvas nur die Pixel kennt.
 *
 * Netlify Forms: ein Upload pro Feld, höchstens 8 MB pro Einsendung, 30 Sekunden
 * Zeitlimit (Netlify-Doku „Forms setup“, Stand 16.09.2026). Die Grenze von 5 MB für das
 * fertige Foto lässt Platz für die übrigen Felder.
 */

export const PHOTO_LIMITS = {
  /** Lange Kante nach dem Verkleinern. */
  maxEdgePx: 2000,
  /** Größe der gewählten Datei, bevor sie verarbeitet wird. */
  maxInputBytes: 20 * 1024 * 1024,
  /** Größe des fertigen JPEG. */
  maxOutputBytes: 5 * 1024 * 1024,
  jpegQuality: 0.85,
} as const;

export const PHOTO_TEXT = {
  label: "Foto des Typenschilds",
  hint:
    "Hilft uns, Ihr vorhandenes Fenster sicher zu bestimmen. Bitte nur das Typenschild " +
    "fotografieren – keine Personen, Hausnummern oder Innenräume.",
  privacy:
    "Ihr Browser verkleinert das Foto vor dem Senden; Standort- und Kameradaten (EXIF/GPS) " +
    "werden dabei entfernt. Bei Netlify ist das Foto über einen nicht veröffentlichten Link " +
    "ohne Anmeldung abrufbar – Einzelheiten in den Datenschutzhinweisen.",
  choose: "Foto auswählen oder aufnehmen",
  processing: "Foto wird vorbereitet …",
  remove: "Foto entfernen",
  uploading:
    "Foto wird hochgeladen – bei langsamer Verbindung kann das bis zu 30 Sekunden dauern.",
  notSentWithMail:
    "Das Foto wird nicht automatisch mitgeschickt – bitte selbst anhängen oder nachreichen.",
  errors: {
    type: "Bitte ein Foto im Format JPEG, PNG oder HEIC auswählen.",
    too_large: "Das Foto ist zu groß (über 20 MB). Bitte ein anderes Foto wählen.",
    heic:
      "Dieses Foto ist im Format HEIC gespeichert, das Ihr Browser nicht umwandeln kann. Bitte das " +
      "Foto als JPEG senden (iPhone: Einstellungen → Kamera → Formate → „Maximale Kompatibilität“) " +
      "oder ein Bildschirmfoto des Typenschilds wählen.",
    decode: "Das Foto konnte nicht gelesen werden. Bitte ein anderes Foto wählen.",
    output_too_large:
      "Das Foto ist auch verkleinert noch größer als 5 MB. Bitte ein anderes Foto wählen.",
  },
} as const;

export type PhotoError = keyof typeof PHOTO_TEXT.errors;

export interface PreparedPhoto {
  blob: Blob;
  fileName: string;
  width: number;
  height: number;
}

export type PreparePhotoResult = { ok: true; photo: PreparedPhoto } | { ok: false; error: PhotoError };

const HEIC_PATTERN = /\.(heic|heif)$/i;

function isHeic(file: File): boolean {
  return /image\/hei[cf]/i.test(file.type) || HEIC_PATTERN.test(file.name);
}

function isImage(file: File): boolean {
  return file.type.startsWith("image/") || isHeic(file) || /\.(jpe?g|png|webp)$/i.test(file.name);
}

type Decoded = { source: CanvasImageSource; width: number; height: number; close: () => void };

async function decode(file: File): Promise<Decoded | null> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    } catch {
      /* Rückfall auf <img> */
    }
  }
  // Aktuelle Browser wenden die EXIF-Drehung auch beim <img> an (image-orientation: from-image).
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => {} };
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function toJpeg(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", PHOTO_LIMITS.jpegQuality));
}

/** Prüft, dreht, verkleinert und kodiert das Foto neu. Wirft nie. */
export async function prepareTypenschildPhoto(file: File): Promise<PreparePhotoResult> {
  try {
    if (!isImage(file)) return { ok: false, error: "type" };
    if (file.size > PHOTO_LIMITS.maxInputBytes) return { ok: false, error: "too_large" };
    const decoded = await decode(file);
    if (!decoded || !decoded.width || !decoded.height) return { ok: false, error: isHeic(file) ? "heic" : "decode" };
    try {
      const scale = Math.min(1, PHOTO_LIMITS.maxEdgePx / Math.max(decoded.width, decoded.height));
      const width = Math.max(1, Math.round(decoded.width * scale));
      const height = Math.max(1, Math.round(decoded.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return { ok: false, error: "decode" };
      ctx.drawImage(decoded.source, 0, 0, width, height);
      const blob = await toJpeg(canvas);
      if (!blob) return { ok: false, error: "decode" };
      if (blob.size > PHOTO_LIMITS.maxOutputBytes) return { ok: false, error: "output_too_large" };
      return { ok: true, photo: { blob, fileName: "typenschild.jpg", width, height } };
    } finally {
      decoded.close();
    }
  } catch {
    return { ok: false, error: "decode" };
  }
}

/** „1.234 KB“ bzw. „1,2 MB“ für den Hinweis unter dem Vorschaubild. */
export function formatPhotoSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString("de-DE")} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString("de-DE", { maximumFractionDigits: 1 })} MB`;
}
