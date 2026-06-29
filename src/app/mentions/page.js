'use client';
import { useEffect } from 'react';
export default function MentionsLegales() {
  useEffect(() => { document.title = 'Mentions Légales | Kelly Dress'; }, []);
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
            <p>Le site Kelly Dress est édité par la société Kelly Dress, maison de haute couture parisienne spécialisée dans la création de robes de mariée sur mesure.</p>
            <p>Raison sociale : Kelly Dress</p>
            <p>Forme juridique : Société à responsabilité limitée (SARL)</p>
            <p>Capital social : [Capital social]</p>
            <p>RCS : [Numéro RCS]</p>
            <p>Numéro de TVA intracommunautaire : [TVA]</p>
            <p>Siège social : [Adresse du siège social]</p>
            <p>Email : kellydressweeding@gmail.com</p>
            <p>Téléphone : [Téléphone]</p>
            <p>Directeur de la publication : [Nom du directeur]</p>
          </section>

          <section>
            <h2>Hébergement</h2>
            <p>Ce site est hébergé par Vercel Inc., société américaine spécialisée dans l'hébergement et le déploiement d'applications web modernes.</p>
            <p>Vercel Inc.</p>
            <p>340 S Lemon Ave #4133</p>
            <p>Walnut, CA 91789, États-Unis</p>
            <p>Site web : https://vercel.com</p>
            <p>L'hébergement est assuré sur des serveurs situés en Europe, garantissant une conformité avec le Règlement Général sur la Protection des Données (RGPD).</p>
          </section>

          <section>
            <h2>Propriété intellectuelle</h2>
            <p>L'ensemble du contenu du site Kelly Dress, incluant mais ne se limitant pas aux textes, photographies, illustrations, vidéos, logos, icônes, designs, maquettes et codes source, est protégé par les lois françaises et internationales sur le droit d'auteur et la propriété intellectuelle.</p>
            <p>Toute reproduction, représentation, modification, adaptation, distribution ou exploitation, partielle ou totale, du contenu du site, par quelque procédé que ce soit, sans l'autorisation écrite et préalable de Kelly Dress est strictement interdite et constituerait une contrefaçon sanctionnée par le Code de la Propriété Intellectuelle.</p>
            <p>Les marques, noms commerciaux et logos figurant sur le site sont des marques déposées par Kelly Dress. Leur utilisation sans autorisation préalable est interdite.</p>
          </section>

          <section>
            <h2>Données personnelles</h2>
            <p>Les données personnelles collectées sur le site Kelly Dress (nom, adresse email, adresse postale, numéro de téléphone, informations de paiement) sont utilisées exclusivement dans le cadre de la gestion des commandes, de la relation client et de l'amélioration de nos services.</p>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles. Vous pouvez également vous opposer au traitement de vos données ou en demander la limitation.</p>
            <p>Pour exercer ces droits, veuillez nous contacter par email à l'adresse kellydressweeding@gmail.com ou par courrier postal à l'adresse de notre siège social. Nous nous engageons à répondre à votre demande dans un délai maximum de 30 jours.</p>
            <p>Vos données ne sont jamais cédées à des tiers à des fins commerciales. Elles peuvent être communiquées aux prestataires techniques nécessaires au traitement de votre commande (transporteurs, prestataires de paiement) dans le strict cadre de leur mission.</p>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>Le site Kelly Dress utilise des cookies et technologies similaires pour améliorer votre expérience de navigation, analyser le trafic du site et personnaliser le contenu proposé. En naviguant sur notre site, vous consentez à l'utilisation de ces cookies conformément à notre politique de confidentialité.</p>
            <p>Vous pouvez à tout moment modifier vos préférences de cookies via les paramètres de votre navigateur. Le refus de certains cookies peut toutefois affecter le fonctionnement optimal du site.</p>
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
