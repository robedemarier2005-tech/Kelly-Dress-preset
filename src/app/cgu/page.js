'use client';
import { useEffect } from 'react';
export default function CGU() {
  useEffect(() => { document.title = 'CGU | Kelly Dress'; }, []);
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
            <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site internet Kelly Dress (ci-après "le Site"), édité par la société Kelly Dress. En accédant au Site et en naviguant sur celui-ci, vous acceptez sans réserve l'intégralité des présentes conditions. Si vous n'acceptez pas ces conditions, nous vous invitons à ne pas utiliser notre Site.</p>
          </section>

          <section>
            <h2>2. Accès au site</h2>
            <p>L'accès au Site est gratuit et ouvert à toute personne disposant d'un accès à internet. Le Site est accessible 24 heures sur 24 et 7 jours sur 7, sauf en cas de force majeure, de maintenance technique ou de décision de la direction de Kelly Dress. Nous mettons tout en œuvre pour garantir la continuité du service, mais ne saurions être tenus responsables des interruptions liées au réseau internet ou aux infrastructures d'hébergement.</p>
            <p>Kelly Dress se réserve le droit de modifier, suspendre ou interrompre l'accès à tout ou partie du Site à tout moment, sans préavis, pour des raisons techniques, de maintenance ou de mise à jour du contenu.</p>
          </section>

          <section>
            <h2>3. Compte utilisateur</h2>
            <p>Pour accéder à certaines fonctionnalités du Site (telles que la gestion des favoris, le suivi des commandes ou l'inscription à la newsletter), la création d'un compte personnel peut être requise. Vous vous engagez à fournir des informations exactes, complètes et à jour lors de la création de votre compte.</p>
            <p>Vous êtes seul responsable de la confidentialité de vos identifiants de connexion (nom d'utilisateur et mot de passe). Toute activité réalisée depuis votre compte est présumée émaner de votre personne. En cas de perte, de vol ou d'utilisation non autorisée de vos identifiants, vous devez en informer immédiatement Kelly Dress.</p>
            <p>Nous nous réservons le droit de supprimer tout compte utilisateur en cas de non-respect des présentes CGU ou de comportement frauduleux.</p>
          </section>

          <section>
            <h2>4. Commandes et paiements</h2>
            <p>Les commandes passées sur le Site sont fermes et définitives après validation du paiement. Les prix affichés sont indiqués en euros (€) toutes taxes comprises (TTC). Les frais de livraison sont précisés avant la validation finale de la commande.</p>
            <p>Le paiement s'effectue par carte bancaire via une plateforme de paiement sécurisée. Les informations bancaires transmises sont cryptées et ne sont jamais stockées sur nos serveurs. Kelly Dress se réserve le droit de refuser ou d'annuler toute commande en cas de litige antérieur, d'incident de paiement ou de suspicion de fraude.</p>
            <p>En passant commande, vous certifiez être majeur et juridiquement capable de contracter. La confirmation de commande vous sera envoyée par email avec le récapitulatif détaillé de vos achats.</p>
          </section>

          <section>
            <h2>5. Livraison et rétractation</h2>
            <p>Les délais de livraison sont indiqués lors de la commande et peuvent varier selon la destination et le type de confection (sur-mesure ou prêt-à-porter). Kelly Dress s'engage à traiter votre commande dans les meilleurs délais.</p>
            <p>Conformément à l'article L221-18 du Code de la Consommation, vous disposez d'un délai de rétractation de 14 jours à compter de la réception de votre commande pour les produits standards. Pour les créations sur-mesure, le droit de rétractation ne s'applique pas conformément à l'article L221-28 du Code de la Consommation.</p>
          </section>

          <section>
            <h2>6. Propriété intellectuelle</h2>
            <p>Tous les éléments du Site (textes, illustrations, photographies, vidéos, logos, icônes, codes sources, base de données) sont la propriété exclusive de Kelly Dress ou de ses partenaires et sont protégés par les lois françaises et internationales sur la propriété intellectuelle.</p>
            <p>Toute reproduction, représentation, modification, adaptation, diffusion ou exploitation, partielle ou totale, du contenu du Site, par quelque procédé que ce soit, sans l'autorisation écrite et préalable de Kelly Dress, est strictement interdite et constitue un acte de contrefaçon passible de poursuites judiciaires.</p>
          </section>

          <section>
            <h2>7. Données personnelles</h2>
            <p>Les données personnelles collectées sur le Site sont traitées dans le respect de notre Politique de Confidentialité et conformément au Règlement Général sur la Protection des Données (RGPD) 2016/679 du Parlement européen. Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données.</p>
            <p>Pour exercer ces droits, veuillez nous contacter à l'adresse email kellydressweeding@gmail.com. Nous nous engageons à traiter votre demande dans un délai maximal de 30 jours.</p>
          </section>

          <section>
            <h2>8. Responsabilité</h2>
            <p>Kelly Dress s'efforce d'assurer l'exactitude et la mise à jour des informations publiées sur le Site. Toutefois, nous ne pouvons garantir l'absence d'erreurs ou d'omissions. L'utilisation du Site se fait sous votre seule responsabilité.</p>
            <p>Kelly Dress ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation du Site, notamment en cas d'interruption du service, d'intrusion extérieure, de présence de virus informatiques ou de tout fait indépendant de notre volonté.</p>
          </section>

          <section>
            <h2>9. Modification des CGU</h2>
            <p>Kelly Dress se réserve le droit de modifier les présentes Conditions Générales d'Utilisation à tout moment, notamment pour s'adapter aux évolutions législatives, réglementaires ou techniques. Les utilisateurs seront informés des modifications par une notification sur le Site ou par email. L'utilisation continue du Site après la publication des modifications vaut acceptation des nouvelles CGU.</p>
          </section>

          <section>
            <h2>10. Droit applicable et juridiction</h2>
            <p>Les présentes CGU sont régies par le droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire. À défaut d'accord, les tribunaux compétents seront ceux du ressort du siège social de Kelly Dress.</p>
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
