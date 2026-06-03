/**
 * Shared content for the 5 landing prototypes.
 * Real Slovenian copy + real project data pulled verbatim from the live
 * WordPress site (letecekele.si, WP REST API). THROWAWAY prototype data —
 * the real build sources this from Sanity (see ADR 0005). Do not add logic here.
 */

export const site = {
  name: 'Leteče Kele',
  wordmarkTop: 'LETEČE KELE',
  wordmarkSub: 'Višinska dela',
  tagline: 'Kvaliteta na višini',
  // company one-liner (from o-podjetju)
  blurb:
    'Sanacija fasad, betona in jeklenih konstrukcij z alpinistično vrvno tehniko — tam, kjer postavljanje odrov ni smotrno.',
}

export const contact = {
  phone: '040 465 749',
  phoneHref: 'tel:+38640465749',
  email: 'info@letecekele.si',
  address: 'Bašelj 37a, 4205 Preddvor',
  vat: 'SI66125235',
  reg: '3564533000',
  bank: 'SI56 0700 0000 1099 973',
  bankName: 'Gorenjska banka',
}

export const hero = {
  eyebrow: 'Alpinistična višinska dela · Slovenija',
  title: 'Sanacije na višini, brez odrov.',
  titleLines: ['Sanacije na višini,', 'brez odrov.'],
  lead:
    'S pomočjo alpinističnega znanja in vrvne tehnike saniramo fasade, betonske površine in jeklene konstrukcije tudi tam, kjer uporaba zidarskih odrov ni smotrna.',
  ctaPrimary: 'Povprašajte po ponudbi',
  ctaSecondary: 'Oglejte si reference',
}

export type Service = {
  slug: string
  title: string
  short: string
  image: string
  ratio: string
  steps: string[]
}

export const services: Service[] = [
  {
    slug: 'sanacija-betonskih-povrsin',
    title: 'Sanacija betonskih površin',
    short:
      'Mehanska odstranitev slabo sprijetega betona, zaščita armature in trajno elastični premaz.',
    image: 'rimska-cesta',
    ratio: '16 / 9',
    steps: [
      'Mehanska odstranitev večjih, slabo sprijetih delov betona',
      'Pranje betonov pod visokim pritiskom (300 barov)',
      'Zaščita odkrite jeklene armature z antikorozijskim premazom',
      'Sanacija betonov z grobo malto',
      'Sanacija betonov s fino malto',
      'Prednamaz pred barvanjem (primer)',
      'Nanos trajno elastične barve (dva nanosa)',
    ],
  },
  {
    slug: 'izolacijska-fasada',
    title: 'Izolacijska fasada',
    short:
      'Toplotna izolacija na že obstoječo fasado — od sidranja do zaglajenega končnega ometa.',
    image: 'novakova',
    ratio: '16 / 9',
    steps: [
      'Sidranje stare fasade (če je to potrebno)',
      'Popravljanje večjih lukenj v obstoječi fasadi s stiroporjem',
      'Lepljenje različno debele izolacije',
      'Nanos izravnalne mase',
      'Mrežica in izravnalna masa',
      'Zaglajeni končni omet, ponavadi 2 – 3 mm',
    ],
  },
  {
    slug: 'sanacija-zeleznih-konstrukcij',
    title: 'Sanacija jeklenih konstrukcij',
    short:
      'Čiščenje do zdravega jekla, varjenje razjedenih mest in večslojni protikorozijski premaz.',
    image: 'cerkev',
    ratio: '3 / 4',
    steps: [
      'Čiščenje stare barve in rje do zdravega jekla',
      'Varjenje preveč razjedenega jekla',
      'Prvi nanos osnovne barve',
      'Drugi nanos osnovne barve (pri zahtevnejših projektih)',
      'Prvi nanos končne barve',
      'Drugi nanos končne barve',
    ],
  },
  {
    slug: 'menjava-diletacijskih-fug',
    title: 'Menjava diletacijskih fug',
    short:
      'Izrez in brušenje starih fug, nova diletacijska pena ter precizen nanos kita.',
    image: 'puhova',
    ratio: '16 / 9',
    steps: [
      'Izrez fug',
      'Brušenje fug (popolna odstranitev starega kita)',
      'Sanacija poškodovanega betona',
      'Namestitev nove diletacijske pene',
      'Nanos lepila (primer) za boljši oprijem kita',
      'Nanos kita (razmerje širine in debeline 2 : 1)',
    ],
  },
  {
    slug: 'postavljanje-soncnih-elektraren',
    title: 'Postavljanje sončnih elektrarn',
    short:
      'Montaža sončnih elektrarn — tudi na zahtevnih in težko dostopnih lokacijah.',
    image: 'soncna-valjavec',
    ratio: '16 / 9',
    steps: [
      'Ogled lokacije in priprava montažne sheme',
      'Pritrditev nosilne konstrukcije',
      'Montaža fotonapetostnih modulov',
      'Električne povezave in zagon',
    ],
  },
]

export type Project = {
  slug: string
  title: string
  location: string
  year: string
  kind: string
  image: string
  ratio: string
  summary: string
}

export const projects: Project[] = [
  {
    slug: 'preglov-trg-10',
    title: 'Preglov trg 10',
    location: 'Ljubljana, Fužine',
    year: '2020',
    kind: 'Sanacija betona in fasade',
    image: 'preglov-trg-10',
    ratio: '4 / 3',
    summary:
      'Celovita sanacija dvanajstnadstropnega bloka s 140 enotami — beton, korita, prane plošče, fuge in odtoki, izvedeno po sklopih z visečim odrom.',
  },
  {
    slug: 'terme-olimia',
    title: 'Terme Olimia',
    location: 'Podčetrtek',
    year: '2018',
    kind: 'Sanacija bazenskega kompleksa',
    image: 'terme-olimia',
    ratio: '16 / 9',
    summary:
      'Lepo, a naporno — višinska dela na bazenskem kompleksu v Termah Olimia.',
  },
  {
    slug: 'rimska-cesta',
    title: 'Rimska cesta 12, 14, 16',
    location: 'Ljubljana',
    year: '2017',
    kind: 'Sanacija betona',
    image: 'rimska-cesta',
    ratio: '16 / 9',
    summary:
      'Sanacija objekta na Rimski cesti, pričeta konec avgusta in nadaljevana spomladi, ko so vremenske razmere dopuščale.',
  },
  {
    slug: 'novakova',
    title: 'Novakova ulica 3',
    location: 'Ljubljana',
    year: '2017',
    kind: 'Izolacijska fasada',
    image: 'novakova',
    ratio: '16 / 9',
    summary:
      'Nov projekt, začet 3. aprila — obnova fasade večstanovanjskega objekta.',
  },
  {
    slug: 'ul-bratov-ucakar',
    title: 'Ulica bratov Učakar 44–46',
    location: 'Ljubljana, Koseze',
    year: '2014',
    kind: 'Sanacija fasade',
    image: 'ul-bratov-ucakar',
    ratio: '4 / 3',
    summary:
      'Po treh letih se je ekipa Letečih kel spet znašla na Ulici bratov Učakar v Kosezah.',
  },
  {
    slug: 'janeziceva',
    title: 'Janežičeva cesta 21',
    location: 'Ljubljana, Prule',
    year: '2013',
    kind: 'Sanacija betona',
    image: 'janeziceva',
    ratio: '4 / 3',
    summary: 'Sredi Ljubljane, natančneje v Prulah — sanacija večstanovanjskega bloka.',
  },
  {
    slug: 'makedonija',
    title: 'Jez Sveta Petka',
    location: 'Severna Makedonija',
    year: '2013',
    kind: 'Specialna višinska dela',
    image: 'makedonija',
    ratio: '2 / 3',
    summary:
      'Nenavaden klic sredi dopusta — specialna višinska dela na jezu Sveta Petka v Makedoniji.',
  },
  {
    slug: 'podlubnik',
    title: 'Podlubnik 153',
    location: 'Škofja Loka',
    year: '2012',
    kind: 'Sanacija betonskih balkonov',
    image: 'podlubnik',
    ratio: '3 / 4',
    summary:
      'Eden izmed treh večjih jesenskih projektov — sanacija betonskih balkonov v Podlubniku.',
  },
  {
    slug: 'vojkova',
    title: 'Vojkova cesta 87',
    location: 'Ljubljana',
    year: '2012',
    kind: 'Sanacija betonske fasade',
    image: 'vojkova',
    ratio: '3 / 4',
    summary:
      'Ena izmed najbolj markantnih stolpnic v prestolnici — sanacija betonske fasade.',
  },
  {
    slug: 'soncna-valjavec',
    title: 'Sončna elektrarna Valjavec',
    location: 'Gorenjska',
    year: '2012',
    kind: 'Sončna elektrarna',
    image: 'soncna-valjavec',
    ratio: '4 / 3',
    summary: 'Postavljanje sončne elektrarne na zahtevni lokaciji.',
  },
]

// "Why us" strip — distilled from the vizija + kvaliteta pages (verbatim spirit).
export const whyUs = [
  {
    title: 'Brez odrov',
    body: 'Z vrvno tehniko in visečimi odri pridemo tja, kjer postavljanje zidarskih odrov ni smotrno.',
  },
  {
    title: 'Krajši rok izvedbe',
    body: 'Delo po sklopih pomeni manj motenj za stanovalce in hitrejši zaključek projekta.',
  },
  {
    title: 'Najkvalitetnejši materiali',
    body: 'Skrbno izbrani materiali, ki ustrezajo ekološkim standardom — že iz naših alpinističnih let.',
  },
  {
    title: 'Vrhunsko usposobljena ekipa',
    body: 'Vsi delavci smo usposobljeni za delo na višini in pripravljeni na največje izzive.',
  },
]

// About story (from o-podjetju + vizija, verbatim).
export const about = {
  lead:
    'Pred petnajstimi leti je štiri mlade fante začela družiti strast do gora.',
  paragraphs: [
    'Pred petnajstimi leti je štiri mlade fante začela družiti strast do gora, sčasoma pa smo svoje alpinistične izkušnje začeli uporabljati tudi pri delu na višini. Slednje je iz občasnega dela ob študiju preraslo v stalno zaposlitev.',
    'Po desetletju dela za različna podjetja smo se odločili ustanoviti lastno podjetje. Leteče kele d.o.o. je mlado podjetje, specializirano za sanacijo večstanovanjskih objektov in opravljanje specialnih višinskih del v gradbeništvu.',
    'S pomočjo alpinističnega znanja in opreme smo sposobni izpeljati projekte, kjer uporaba zidarskih odrov ni smotrna. Večina našega dela poteka s pomočjo vrvne tehnike in visečih odrov.',
  ],
}

export const stats = [
  { value: '2012', label: 'aktivni od' },
  { value: '15+', label: 'let na višini' },
  { value: '140', label: 'enot na enem bloku' },
  { value: '100%', label: 'brez gradbenih odrov' },
]

// Image natural dimensions (px) for explicit width/height → no CLS.
export const imageDims: Record<string, { w: number; h: number }> = {
  'preglov-trg-10': { w: 1280, h: 960 },
  'terme-olimia': { w: 1280, h: 720 },
  'rimska-cesta': { w: 1280, h: 720 },
  novakova: { w: 1280, h: 720 },
  'ul-bratov-ucakar': { w: 1280, h: 960 },
  janeziceva: { w: 1280, h: 960 },
  makedonija: { w: 856, h: 1280 },
  podlubnik: { w: 960, h: 1280 },
  vojkova: { w: 960, h: 1280 },
  'soncna-valjavec': { w: 1280, h: 960 },
  cerkev: { w: 960, h: 1280 },
  puhova: { w: 1280, h: 960 },
  copic: { w: 1280, h: 960 },
  mavricna: { w: 1280, h: 960 },
  'p-slavija': { w: 960, h: 1280 },
  'kvaliteta-visini': { w: 1280, h: 960 },
  'ulica-bratov-40': { w: 1280, h: 960 },
}
