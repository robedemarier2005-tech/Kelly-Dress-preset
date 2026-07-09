'use client';
import React, { useEffect } from 'react';

export default function About() {
  useEffect(() => { document.title = 'À Propos | Kelly Dress'; }, []);
  return (
    <div className="about-wrapper">
      <section id="notre-engagement" className="engagement-section section-padding">
        <div className="container">
          <div className="engagement-inner">
            <span className="engagement-subtitle">NOTRE ENGAGEMENT</span>
            <h2 className="engagement-main-title">Chaque Mariée, Une Création Unique</h2>
            <div className="engagement-body">
              <p className="engagement-p">
                Chez Kelly Dress, nous croyons qu'une robe de mariée est bien plus qu'une création couture : elle raconte une histoire, sublime une personnalité et accompagne l'un des plus beaux instants d'une vie.
              </p>
              <p className="engagement-p">
                Chaque modèle est imaginé et confectionné avec une attention absolue aux détails, dans le respect des savoir-faire artisanaux et des matières d'exception. De la première rencontre jusqu'aux derniers ajustements, nous accompagnons chaque future mariée avec écoute, passion et exigence afin de créer une robe qui lui ressemble parfaitement.
              </p>
              <p className="engagement-p">
                Notre engagement est simple : offrir une expérience sur mesure, où chaque détail est pensé pour faire de votre mariage un moment inoubliable.
              </p>
            </div>
            <div className="engagement-cards">
              <div className="engagement-card">
                <span className="engagement-card-icon">✨</span>
                <h3 className="engagement-card-title">Création sur mesure</h3>
                <p className="engagement-card-text">Chaque robe est dessinée selon votre silhouette et votre personnalité.</p>
              </div>
              <div className="engagement-card">
                <span className="engagement-card-icon">🧵</span>
                <h3 className="engagement-card-title">Savoir-faire artisanal</h3>
                <p className="engagement-card-text">Une confection réalisée avec des finitions haute couture et des matières nobles.</p>
              </div>
              <div className="engagement-card">
                <span className="engagement-card-icon">🤍</span>
                <h3 className="engagement-card-title">Accompagnement personnalisé</h3>
                <p className="engagement-card-text">De la première esquisse jusqu'au jour J, nous sommes à vos côtés.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-wrapper {
          background-color: var(--color-white);
          padding-top: 100px;
        }

        .engagement-section {
          background-color: var(--color-white);
        }

        .engagement-inner {
          max-width: 820px;
          margin: 0 auto;
          text-align: center;
        }

        .engagement-subtitle {
          display: block;
          font-family: var(--font-sans);
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          color: var(--color-gold);
          margin-bottom: 24px;
        }

        .engagement-main-title {
          font-family: var(--font-serif);
          font-size: 2.6rem;
          font-weight: 400;
          color: var(--color-black);
          margin-bottom: 40px;
          line-height: 1.2;
        }

        .engagement-body {
          max-width: 680px;
          margin: 0 auto 60px;
        }

        .engagement-p {
          font-size: 0.95rem;
          color: var(--color-charcoal);
          line-height: 1.9;
          margin-bottom: 20px;
        }

        .engagement-p:last-child {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          font-style: italic;
          color: var(--color-black);
        }

        .engagement-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          max-width: 900px;
          margin: 0 auto;
        }

        .engagement-card {
          text-align: center;
          padding: 40px 24px;
          border: 1px solid var(--color-beige-light);
          border-radius: 2px;
          transition: border-color 0.4s ease, transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .engagement-card:hover {
          border-color: var(--color-gold);
          transform: translateY(-4px);
        }

        .engagement-card-icon {
          display: block;
          font-size: 1.8rem;
          margin-bottom: 20px;
        }

        .engagement-card-title {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          font-weight: 400;
          color: var(--color-black);
          margin-bottom: 12px;
        }

        .engagement-card-text {
          font-size: 0.85rem;
          color: var(--color-gray-medium);
          line-height: 1.7;
        }

        @media (max-width: 768px) {
          .engagement-main-title {
            font-size: 2rem;
          }

          .engagement-cards {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .engagement-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}
