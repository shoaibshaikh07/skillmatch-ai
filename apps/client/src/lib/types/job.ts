export type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  skills: string[];
  createdAt: Date;
  applicationClosed: boolean;
  closedAt?: Date;
  updatedAt: Date;
};
