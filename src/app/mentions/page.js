'use client';
export default function MentionsLegales() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="translation-warning">
          ⚠️ Cette page n'est pas encore traduite. Version française uniquement.
        </div>
        <h1>Mentions Légales</h1>
        <div className="legal-content">
          <section>
            <h2>Éditeur du site</h2>
            <p>Kelly Dress</p>
            <p>Adresse : [Votre adresse]</p>
            <p>Email : contact@kellydress.com</p>
            <p>Téléphone : [Votre numéro]</p>
          </section>

          <section>
            <h2>Hébergement</h2>
            <p>Ce site est hébergé par Vercel Inc.</p>
            <p>340 S Lemon Ave #4133</p>
            <p>Walnut, CA 91789, USA</p>
          </section>

          <section>
            <h2>Propriété intellectuelle</h2>
            <p>L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>
          </section>

          <section>
            <h2>Données personnelles</h2>
            <p>Les données collectées sur ce site sont utilisées uniquement dans le cadre de la relation commerciale. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</p>
          </section>
        </div>
      </div>

      <style jsx>{`
        .legal-page {
          padding: 120px 0 80px;
          min-height: 100vh;
          background-color: var(--color-ivory);
        }

        .translation-warning {
          background-color: #fff3cd;
          border: 1px solid #ffc107;
          color: #856404;
          padding: 15px 20px;
          border-radius: 4px;
          margin-bottom: 30px;
          font-size: 0.9rem;
          text-align: center;
        }

        .legal-page h1 {
          font-family: var(--font-serif);
          font-size: 3rem;
          color: var(--color-black);
          margin-bottom: 60px;
          text-align: center;
        }

        .legal-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .legal-content section {
          margin-bottom: 40px;
        }

        .legal-content h2 {
          font-family: var(--font-sans);
          font-size: 1.5rem;
          color: var(--color-gold);
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .legal-content p {
          font-size: 1rem;
          color: var(--color-charcoal);
          line-height: 1.8;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
}
