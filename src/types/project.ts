export type Project = {
  id: string;
  title: string;
  description: string;
  details: string;
  images: string[];
  urlLink?: string | null;
  featured: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ProjectCreateInput = Omit<
  Project,
  "id" | "createdAt" | "updatedAt"
>;
export type ProjectUpdateInput = Partial<ProjectCreateInput>;
