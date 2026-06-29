'use client';
export default function CGU() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="translation-warning">
          ⚠️ Cette page n'est pas encore traduite. Version française uniquement.
        </div>
        <h1>Conditions Générales d'Utilisation</h1>
        <div className="legal-content">
          <section>
            <h2>1. Objet</h2>
            <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du site internet Kelly Dress. En accédant à ce site, vous acceptez ces conditions.</p>
          </section>

          <section>
            <h2>2. Accès au site</h2>
            <p>L'accès au site est gratuit et ouvert à tous les utilisateurs. Le site s'efforce de rester accessible 24h/24 et 7j/7, mais ne peut garantir une disponibilité permanente.</p>
          </section>

          <section>
            <h2>3. Compte utilisateur</h2>
            <p>Pour certaines fonctionnalités, la création d'un compte peut être nécessaire. Vous vous engagez à fournir des informations exactes et à maintenir la confidentialité de vos identifiants de connexion.</p>
          </section>

          <section>
            <h2>4. Commandes et paiements</h2>
            <p>Les commandes passées sur le site sont fermes et définitives après validation du paiement. Les prix sont indiqués en euros toutes taxes comprises.</p>
          </section>

          <section>
            <h2>5. Propriété intellectuelle</h2>
            <p>Tous les éléments du site (textes, images, vidéos, logos) sont la propriété de Kelly Dress ou de ses partenaires. Toute reproduction est interdite sans autorisation.</p>
          </section>

          <section>
            <h2>6. Données personnelles</h2>
            <p>Les données personnelles collectées sont traitées conformément à notre Politique de Confidentialité et au RGPD.</p>
          </section>

          <section>
            <h2>7. Modification des CGU</h2>
            <p>Kelly Dress se réserve le droit de modifier ces CGU à tout moment. Les utilisateurs seront informés des modifications par email sur le site.</p>
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
