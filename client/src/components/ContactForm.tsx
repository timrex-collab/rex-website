export default function ContactForm() {
  return (
    <form
      name="kontakt"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      action="/danke.html"
      className="space-y-6"
    >
      {/* SPAM-Honeypot */}
      <div style={{ display: 'none' }}>
        <label>Nicht ausfüllen: <input name="bot-field" /></label>
      </div>

      {/* Pflicht: Formularname für Netlify */}
      <input type="hidden" name="form-name" value="kontakt" />

      <div>
        <label className="block text-sm font-semibold mb-2">
          Name*
        </label>
        <input 
          type="text" 
          name="name" 
          required 
          className="w-full px-4 py-3 border-2 border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          data-testid="input-name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          E-Mail*
        </label>
        <input 
          type="email" 
          name="email" 
          required 
          className="w-full px-4 py-3 border-2 border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          data-testid="input-email"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Telefonnummer
        </label>
        <input 
          type="tel" 
          name="telefon" 
          className="w-full px-4 py-3 border-2 border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          data-testid="input-phone"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Nachricht*
        </label>
        <textarea 
          name="nachricht" 
          rows={10} 
          required
          className="w-full px-4 py-3 border-2 border-black rounded-md text-base resize-y min-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          data-testid="input-message"
        ></textarea>
      </div>

      <div>
        <button 
          type="submit"
          className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-md font-semibold text-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          data-testid="button-submit"
        >
          Nachricht senden
        </button>
      </div>
    </form>
  );
}
