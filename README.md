# 🎬 Kino Finder

En moderne Progressive Web App (PWA) for å finne filmer som vises på kino i Norge, med informasjon om hvor lenge de har vært vist og hvor lenge de har igjen.

## Funksjoner

- 🎥 **Nåværende og kommende filmer** - Se hvilke filmer som vises nå og kommer snart på norske kinoer
- 🏙️ **Byvalg** - Velg din by fra en liste over store byer i Norge
- 🔍 **Søk** - Søk etter spesifikke filmer
- ⏱️ **Kinotid** - Se hvor lenge filmen har vært på kino og estimert tid igjen
- 🎬 **Trailer** - Direkte lenker til trailers på YouTube
- ⭐ **Vurderinger** - TMDB, IMDB og Rotten Tomatoes score
- 📱 **PWA** - Installer som app på mobil eller desktop
- 🌐 **Offline støtte** - Fungerer offline med cache

## Teknologi

- **React** - UI bibliotek
- **TypeScript** - Type-sikker kode
- **Vite** - Rask build tool
- **PWA** - Progressive Web App med service worker
- **TMDB API** - Film data og trailers
- **OMDb API** - IMDB og Rotten Tomatoes vurderinger

## Installasjon

### 1. Klone prosjektet

```bash
git clone <repository-url>
cd Movies_showing
```

### 2. Installer avhengigheter

```bash
npm install
```

### 3. Sett opp API-nøkler

Opprett en `.env` fil i rot-mappen basert på `.env.example`:

```bash
cp .env.example .env
```

Rediger `.env` filen og legg til dine API-nøkler:

#### TMDB API Key
1. Gå til [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Opprett en gratis konto
3. Gå til [API innstillinger](https://www.themoviedb.org/settings/api)
4. Generer en API-nøkkel (v3 auth)
5. Kopier nøkkelen til `.env` filen

#### OMDb API Key
1. Gå til [OMDb API](http://www.omdbapi.com/apikey.aspx)
2. Velg gratisversjonen (1000 daglige requests)
3. Oppgi din e-post og aktiver nøkkelen
4. Kopier nøkkelen til `.env` filen

Din `.env` fil skal se slik ut:
```
VITE_TMDB_API_KEY=din_tmdb_nøkkel_her
VITE_OMDB_API_KEY=din_omdb_nøkkel_her
```

### 4. Kjør utviklingsserver

```bash
npm run dev
```

Appen kjører nå på `http://localhost:5173`

### 5. Bygg for produksjon

```bash
npm run build
```

Build-filene genereres i `dist/` mappen.

### 6. Forhåndsvis produksjonsbygg

```bash
npm run preview
```

## Bruk

### Velg by
Bruk dropdown-menyen øverst for å velge din by. Appen viser filmer for norske kinoer.

### Se filmer
- **Nå på kino** - Filmer som vises for øyeblikket
- **Kommer snart** - Kommende filmpremierer

### Søk etter filmer
Bruk søkefeltet for å finne spesifikke filmer.

### Se filmdetaljer
Klikk på et filmkort for å se:
- Full beskrivelse
- Trailer på YouTube
- TMDB, IMDB og Rotten Tomatoes vurderinger
- Varighet, sjanger og annen metadata
- Hvor lenge filmen har vært på kino
- Estimert tid igjen i kinoer

### Installer som app
På mobil eller desktop, klikk på "installer" ikonet i nettleseren for å legge til appen på hjemskjermen.

## Prosjektstruktur

```
Movies_showing/
├── public/              # Statiske filer
├── src/
│   ├── components/      # React komponenter
│   │   ├── MovieCard.tsx
│   │   └── MovieDetails.tsx
│   ├── data/           # Data filer (byer)
│   │   └── cities.ts
│   ├── services/       # API tjenester
│   │   ├── tmdb.ts
│   │   └── omdb.ts
│   ├── types/          # TypeScript typer
│   │   └── movie.ts
│   ├── App.tsx         # Hoved app komponent
│   ├── App.css         # App styling
│   ├── index.css       # Global styling
│   └── main.tsx        # Entry point
├── .env.example        # Eksempel miljøvariabler
├── vite.config.ts      # Vite konfigurasjon
├── package.json        # Avhengigheter
└── README.md           # Denne filen
```

## API-er

### TMDB (The Movie Database)
- Gratis API for film-metadata
- Inkluderer trailers, plakater, vurderinger
- Norsk språkstøtte
- [Dokumentasjon](https://developers.themoviedb.org/3)

### OMDb (Open Movie Database)
- Gratis tier: 1000 requests/dag
- Gir IMDB og Rotten Tomatoes vurderinger
- [Dokumentasjon](http://www.omdbapi.com/)

## Estimering av kinotid

Appen estimerer hvor lenge en film har igjen på kino basert på:
- Faktisk utgivelsesdato (fra TMDB)
- Gjennomsnittlig kinoperiode (ca. 6 uker/42 dager)

**Merk:** Dette er kun estimater. Faktisk kinotid varierer basert på filmens popularitet og kino.

## Begrensninger

- API-nøkler har daglige grenser
- Kinotid er estimert, ikke faktisk data fra kinoer
- Norske kinodata kan være begrenset i TMDB
- Rotten Tomatoes score er ikke alltid tilgjengelig

## Lisens

MIT

## Bidrag

Pull requests er velkomne! For større endringer, vennligst åpne en issue først for å diskutere hva du vil endre.

## Support

For problemer eller spørsmål, åpne en issue på GitHub.
