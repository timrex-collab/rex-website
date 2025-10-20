import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    honeypot: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.honeypot) {
      return;
    }

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
