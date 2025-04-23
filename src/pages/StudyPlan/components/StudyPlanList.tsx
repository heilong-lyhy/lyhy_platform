import React from 'react';
import { List, Button } from 'antd';
import StudyPlanTable from './StudyPlanTable';
import dayjs from 'dayjs';
import './StudyPlanList.less';

// 主计划数据结构
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
  id: number;
  title: string;
  completed: boolean;
}

const StudyPlanList: React.FC = () => {
  // 示例主计划数据
  const [mainPlans, setMainPlans] = React.useState<MainPlan[]>([
    {
      id: 1,
      title: "前端学习计划",
      description: "掌握React和TypeScript开发",
      createdAt: dayjs(),
      deadline: dayjs().add(30, 'day'),
      subItems: [
        { id: 1, title: "学习React基础", completed: true },
        { id: 2, title: "掌握TypeScript", completed: false }
      ]
    },
    {
      id: 2,
      title: "前端学习计划",
      description: "掌握React和TypeScript开发",
      createdAt: dayjs(),
      deadline: dayjs().add(30, 'day'),
      subItems: [
        { id: 1, title: "学习React基础", completed: true },
        { id: 2, title: "掌握TypeScript", completed: false }
      ]
    }
  ]);

  return (
    <div className="main-plan-list">
      <Button 
        type="primary" 
        style={{ marginBottom: 16 }}
        onClick={() => console.log('进入编辑模式')}
      >
        编辑所有计划
      </Button>

      <List
        itemLayout="vertical"
        dataSource={mainPlans}
        renderItem={plan => (
          <List.Item
            key={plan.id}
            extra={
              <div style={{ minWidth: 120 }}>
                <p>创建时间: {plan.createdAt.format('YYYY-MM-DD')}</p>
                <p>截止时间: {plan.deadline.format('YYYY-MM-DD')}</p>
              </div>
            }
          >
            <List.Item.Meta
              title={<h3>{plan.title}</h3>}
              description={plan.description}
            />
            
            {/* 嵌套子项表格 */}
            <StudyPlanTable 
              // // items={plan.subItems} 
              // onEdit={() => console.log('编辑子项', plan.id)}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default StudyPlanList;