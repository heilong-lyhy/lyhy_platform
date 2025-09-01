interface PlanList {
  username?: string;
  mainplans?: number[];
}

interface SubItem {
  subid?: number | null;
  subtitle: string;
  description: string;
  completed: boolean;
  subdeadline?: string;
  updatedAt?: string;
}

interface MainPlan {
  planid: number;
  plantitle: string;
  description: string;
  createdAt?: string;
  deadline?: string;
  subItems: SubItem[];
}
