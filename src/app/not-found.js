'use client';
import Link from 'next/link';
import { useTranslation } from '../context/LanguageContext';

export default function NotFound() {
  const { t } = useTranslation();
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '4rem',
        fontWeight: '300',
        color: 'var(--color-black)',
        marginBottom: '20px'
      }}>404</h1>
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '2rem',
        fontWeight: '300',
        color: 'var(--color-gold)',
        marginBottom: '20px'
      }}>Page Non Trouvée</h2>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '1rem',
        color: 'var(--color-gray-medium)',
        marginBottom: '40px',
        maxWidth: '500px'
      }}>
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link 
        href="/catalog"
        style={{
          backgroundColor: 'var(--color-gold)',
          color: 'var(--color-white)',
          padding: '15px 40px',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}
      >
        Retour au Catalogue
      </Link>
    </div>
  );
}
