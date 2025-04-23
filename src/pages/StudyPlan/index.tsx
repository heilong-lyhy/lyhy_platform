import React from 'react';
import StudyPlanCalendar from './components/StudyPlanCalendar';
import StudyPlanList from './components/StudyPlanList'; // 新增同级组件
import './index.less';

const StudyPlan: React.FC = () => {
  return (
    <div className='main'>
      <div className='main-native'>
        {/* 日历组件 */}
        <div className='studyplancalendar'>
          <StudyPlanCalendar />
        </div>
        
        {/* 新增的列表组件（原StudyPlanTable的上级） */}
        <div className='studyplanlist'>
          <StudyPlanList />
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;