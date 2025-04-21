import React from'react';
import StudyPlanTable from './components/StudyPlanTable';
import StudyPlanCalendar from './components/StudyPlanCalendar';
import './index.less';

const StudyPlan: React.FC = () => {
  // const [studyPlan, setStudyPlan] = React.useState([]);
  return (
    <div>
      <StudyPlanTable />
      <StudyPlanCalendar />
    </div>
  );
};

export default StudyPlan;