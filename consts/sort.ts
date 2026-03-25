export const sort = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type Sort = (typeof sort)[keyof typeof sort];
