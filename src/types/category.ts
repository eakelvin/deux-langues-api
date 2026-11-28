import type { errorCategories } from "../constants/categories.js";

export type ErrorCategory = (typeof errorCategories)[number];
