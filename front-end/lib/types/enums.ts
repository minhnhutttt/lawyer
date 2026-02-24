export const LAWYER_SPECIALTIES = [
  "corporate",
  "debtSettlement",
  "trafficAccident",
  "divorce",
  "inheritance",
  "labor",
  "debtCollection",
  "medical",
  "fraud",
  "international",
  "internet",
  "criminal",
  "realEstate",
  "taxLitigation"
] as const;

export const LANGUAGES = [
  "japanese",
  "english"
] as const;

export type Language = typeof LANGUAGES[number]; 