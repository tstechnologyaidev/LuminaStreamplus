import { useEffect, useState } from 'react';
import './Maintenance.css';

function Maintenance({ onBypass }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    try {
      const nav = (navigator && navigator.language) || 'en';
      if (nav && nav.toLowerCase().startsWith('fr')) setLang('fr');
    } catch (e) {
      /* ignore in non-browser env */
    }
  }, []);

  const t = (key) => {
    const msgs = {
      en: {
        title: 'Maintenance Mode',
        message: 'We are currently making improvements to the site. Please check back soon.',
        note: 'If you are an admin, you can bypass this page to continue working.',
        bypass: 'Admin bypass',
        switchTo: 'Français'
      },
      fr: {
        title: 'Mode maintenance',
        message: "Nous procédons actuellement à des améliorations du site. Merci de revenir bientôt.",
        note: "Si vous êtes administrateur, vous pouvez ignorer cette page pour continuer à travailler.",
        bypass: "Passer en tant qu'administrateur",
        switchTo: 'English'
      }
    };
    return msgs[lang][key];
  };

  return (
    <div className="maintenance-page">
      <div className="maintenance-panel">
        <div className="maintenance-top">
          <h1>{t('title')}</h1>
          <button
            className="lang-toggle"
            onClick={() => setLang((l) => (l === 'en' ? 'fr' : 'en'))}
            aria-label="Toggle language"
          >
            {t('switchTo')}
          </button>
        </div>

        <p>{t('message')}</p>
        <p className="maintenance-note">{t('note')}</p>
        <button className="maintenance-btn" onClick={onBypass}>
          {t('bypass')}
        </button>
      </div>
    </div>
  );
}

export default Maintenance;
