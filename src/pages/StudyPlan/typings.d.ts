interface MainPlan {
    id: number;
    title: string;
    description: string;
    createdAt: dayjs.Dayjs;
    deadline: dayjs.Dayjs;
    subItems: SubItem[];
  }
  
  // 子项数据结构
  interface SubItem {
    id: React.Key;
    title?: string;
    readonly?: string;
    description?: string;
    completed?: boolean;
    createdAt?: number;
    updatedAt?: number;
    children?: SubItem[];
  }

  interface TableProps {
    items: SubItem[];
  }