export type ClientType<T> = Omit<T, "createdAt" | "updatedAt"> & {
  createdAt: number;
  updatedAt: number;
};
