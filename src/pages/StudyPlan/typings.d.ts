interface MainPlan {
    planid: number;
    plantitle: string;
    description: string;
    createdAt: dayjs.Dayjs;
    deadline: dayjs.Dayjs;
    subItems: SubItem[];
  }
  
  // 子项数据结构
  interface SubItem {
    subid: React.Key;
    subtitle?: string;
    description?: string;
    completed?: boolean;
    createdAt?: number;
    updatedAt?: number;
    children?: SubItem[];
  }

  interface TableProps {
    items: SubItem[];
    onSubItemChange: (newItems: SubItem[]) => void;
  }