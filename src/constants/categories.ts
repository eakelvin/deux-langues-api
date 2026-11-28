export const errorCategories = [
  "adjective_agreement",
  "noun_agreement",
  "verb_tense",
  "verb_conjugation",
  "mood",
  "auxiliary",
  "preposition",
  "gender",
  "article",
  "pronoun",
  "negation",
  "vocabulary",
  "word_order",
  "spelling",
  "plural",
] as const;

export const categoryList = errorCategories.join(", ");
