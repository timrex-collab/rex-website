export default function ContactForm() {
  return (
    <form
      name="kontakt"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      action="/danke.html"
    >
      {/* SPAM-Honeypot */}
      <p style={{ display: 'none' }}>
        <label>Nicht ausfüllen: <input name="bot-field" /></label>
      </p>

      {/* Pflicht: Formularname für Netlify */}
      <input type="hidden" name="form-name" value="kontakt" />

      <p>
        <label>
          Name*<br />
          <input type="text" name="name" required />
        </label>
      </p>

      <p>
        <label>
          E-Mail*<br />
          <input type="email" name="email" required />
        </label>
      </p>

      <p>
        <label>
          Telefonnummer<br />
          <input type="tel" name="telefon" />
        </label>
      </p>

      <p>
        <label>
          Nachricht*<br />
          <textarea name="nachricht" rows={6} required></textarea>
        </label>
      </p>

      <p>
        <button type="submit">Nachricht senden</button>
      </p>
    </form>
  );
}
