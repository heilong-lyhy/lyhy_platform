import StudyPlanCalendar from './components/StudyPlanCalendar';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import StudyPlanList from './components/StudyPlanList'; // 新增同级组件
import './index.less';
// import type { MainPlan } from './typings.d.ts'; // 假设已定义类型

const StudyPlan: React.FC = () => {
  // 状态提升：将主计划状态移至index组件管理
  const [mainPlans, setMainPlans] = React.useState<MainPlan[]>([
    {
      planid: 1,
      plantitle: "前端学习计划",
      description: "掌握React和TypeScript开发",
      createdAt: dayjs(),
      deadline: dayjs().add(30, 'day'),
      subItems: [
        {
          subid: 624748504,
          subtitle: '活动名称一',
          description: '这个活动真好玩',
          completed: false,
          subdeadline: 1590486176000,
          updatedAt: 1590486176000,
        },
        {
          subid: 624691229,
          subtitle: '活动名称二',
          description: '这个活动真好玩',
          completed: false,
          subdeadline: 1590481162000,
          updatedAt: 1590481162000,
        },
      ]
    },
    {
      planid: 2,
      plantitle: "前端学习计划2",
      description: "掌握React和TypeScript开发",
      createdAt: dayjs(),
      deadline: dayjs().add(30, 'day'),
      subItems: [
        {
          subid: 624748504,
          subtitle: '活动名称一',
          description: '这个活动真好玩',
          completed: true,
          subdeadline: 1590486176000,
          updatedAt: 1590486176000,
        },
        {
          subid: 624691229,
          subtitle: '活动名称二',
          description: '这个活动真好玩',
          completed: false,
          subdeadline: 1590481162000,
          updatedAt: 1590481162000,
        },
      ]
    }
  ]);

  const handlemainplanitemChange = (newmainplan: MainPlan[]) => {
    setMainPlans(newmainplan);
  };

  return (
    <div className='main'>
      <div className='main-native'>
        {/* 日历组件：传递所有主计划的subItems合并数组 */}
        <div className='studyplancalendar'>
          <StudyPlanCalendar items={mainPlans.flatMap(plan => plan.subItems)} />
        </div>
        
        {/* 列表组件：传递主计划数据和更新回调 */}
        <div className='studyplanlist'>
          <StudyPlanList 
// 推测需要确保 StudyPlanList 组件能正确接收 mainplanitem 属性，可能需要定义组件的 Props 类型
// 假设 StudyPlanList 组件已正确定义接收 mainplanitem 和 onmainplanitemChange 属性
            mainplanitem={mainPlans}
            onmainplanitemChange={handlemainplanitemChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;