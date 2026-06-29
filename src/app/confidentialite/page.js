'use client';
export default function PolitiqueConfidentialite() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="translation-warning">
          ⚠️ Cette page n'est pas encore traduite. Version française uniquement.
        </div>
        <h1>Politique de Confidentialité</h1>
        <div className="legal-content">
          <section>
            <h2>1. Collecte des données</h2>
            <p>Nous collectons les données personnelles suivantes : nom, prénom, adresse email, adresse de livraison, informations de paiement. Ces données sont collectées lors de la création de compte, de la passation de commande ou de l'inscription à la newsletter.</p>
          </section>

          <section>
            <h2>2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour : traiter vos commandes, gérer votre compte, vous envoyer des communications commerciales (avec votre consentement), améliorer nos services et assurer la sécurité du site.</p>
          </section>

          <section>
            <h2>3. Partage des données</h2>
            <p>Nous ne partageons vos données qu'avec les tiers nécessaires au traitement de vos commandes (transporteurs, prestataires de paiement) et dans le cadre des obligations légales. Nous ne vendons pas vos données à des tiers.</p>
          </section>

          <section>
            <h2>4. Conservation des données</h2>
            <p>Vos données sont conservées pendant la durée nécessaire à la finalité pour laquelle elles ont été collectées, conformément aux obligations légales. Vous pouvez demander la suppression de vos données à tout moment.</p>
          </section>

          <section>
            <h2>5. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants : droit d'accès, de rectification, de suppression, de limitation du traitement, d'opposition et à la portabilité de vos données. Pour exercer ces droits, contactez-nous à contact@kellydress.com.</p>
          </section>

          <section>
            <h2>6. Cookies</h2>
            <p>Ce site utilise des cookies pour améliorer votre expérience de navigation, analyser le trafic et personnaliser le contenu. Vous pouvez gérer vos préférences cookies via les paramètres de votre navigateur.</p>
          </section>

          <section>
            <h2>7. Sécurité</h2>
            <p>Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données contre l'accès non autorisé, la modification, la destruction ou la perte accidentelle.</p>
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
