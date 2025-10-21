import { useState, useEffect } from 'react';

export const ApiStatus: React.FC = () => {
  const [tmdbConfigured, setTmdbConfigured] = useState(false);
  const [omdbConfigured, setOmdbConfigured] = useState(false);

  useEffect(() => {
    const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;
    const omdbKey = import.meta.env.VITE_OMDB_API_KEY;

    setTmdbConfigured(!!(tmdbKey && tmdbKey !== 'your_tmdb_api_key_here'));
    setOmdbConfigured(!!(omdbKey && omdbKey !== 'your_omdb_api_key_here'));
  }, []);

  if (tmdbConfigured && omdbConfigured) {
    return null; // Don't show if all is configured
  }

  return (
    <div className="api-status-banner">
      <div className="api-status-content">
        <h3>⚠️ API-nøkler mangler</h3>
        <p>For full funksjonalitet, sett opp følgende API-nøkler i <code>.env</code>-filen:</p>
        <ul>
          {!tmdbConfigured && (
            <li>
              <strong>TMDB API Key</strong> (påkrevd) - Hent fra{' '}
              <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer">
                TMDB
              </a>
            </li>
          )}
          {!omdbConfigured && (
            <li>
              <strong>OMDb API Key</strong> (for IMDB & Rotten Tomatoes) - Hent fra{' '}
              <a href="http://www.omdbapi.com/apikey.aspx" target="_blank" rel="noopener noreferrer">
                OMDb
              </a>
            </li>
          )}
        </ul>
        <p className="api-status-note">Se README.md for detaljerte instruksjoner</p>
      </div>
    </div>
  );
};
