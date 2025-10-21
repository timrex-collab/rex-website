import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

export default function ContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    honeypot: "",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.honeypot) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('honeypot', formData.honeypot);
      
      selectedImages.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Fehler beim Senden');
      }

      toast({
        title: "Nachricht gesendet",
        description: "Vielen Dank für Ihre Anfrage. Wir melden uns zeitnah bei Ihnen.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        honeypot: "",
      });
      setSelectedImages([]);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        toast({
          title: "Ungültiger Dateityp",
          description: `${file.name} ist kein gültiges Bildformat. Nur JPEG, PNG, GIF und WebP sind erlaubt.`,
          variant: "destructive",
        });
      } else if (!isValidSize) {
        toast({
          title: "Datei zu groß",
          description: `${file.name} ist größer als 5MB.`,
          variant: "destructive",
        });
      }
      
      return isValidType && isValidSize;
    });

    setSelectedImages((prev) => {
      const newImages = [...prev, ...validFiles];
      if (newImages.length > 5) {
        toast({
          title: "Zu viele Bilder",
          description: "Sie können maximal 5 Bilder hochladen.",
          variant: "destructive",
        });
        return newImages.slice(0, 5);
      }
      return newImages;
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-contact">
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <Label htmlFor="honeypot">Bitte nicht ausfüllen</Label>
        <Input
          type="text"
          id="honeypot"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-2"
          data-testid="input-name"
        />
      </div>

      <div>
        <Label htmlFor="email">E-Mail *</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-2"
          data-testid="input-email"
        />
      </div>

      <div>
        <Label htmlFor="phone">Telefon</Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-2"
          data-testid="input-phone"
        />
      </div>

      <div>
        <Label htmlFor="message">Ihre Nachricht *</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="mt-2"
          data-testid="input-message"
        />
      </div>

      <div>
        <Label htmlFor="images">Bilder anhängen (optional)</Label>
        <div className="mt-2">
          <label
            htmlFor="images"
            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md cursor-pointer hover-elevate active-elevate-2"
            data-testid="label-image-upload"
          >
            <Upload className="w-5 h-5" />
            <span className="text-sm">
              Bilder auswählen (max. 5 Bilder, je max. 5MB)
            </span>
            <input
              type="file"
              id="images"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              onChange={handleImageChange}
              className="hidden"
              disabled={isSubmitting}
              data-testid="input-images"
            />
          </label>

          {selectedImages.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                {selectedImages.length} {selectedImages.length === 1 ? 'Bild' : 'Bilder'} ausgewählt
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {selectedImages.map((file, index) => (
                  <div
                    key={index}
                    className="relative group rounded-md overflow-hidden border"
                    data-testid={`image-preview-${index}`}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Vorschau ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Bild ${index + 1} entfernen`}
                      data-testid={`button-remove-image-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        variant="default"
        size="lg"
        className="w-full md:w-auto"
        disabled={isSubmitting}
        data-testid="button-submit-contact"
      >
        {isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
      </Button>
    </form>
  );
}
