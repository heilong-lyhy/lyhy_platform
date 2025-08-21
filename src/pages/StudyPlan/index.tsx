import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import StudyPlanCalendar from './components/StudyPlanCalendar';
import StudyPlanList from './components/StudyPlanList';
import './index.less';

// // 定义与其他组件兼容的类型
// interface SubItem {
//   subid: number;
//   subtitle: string;
//   description: string;
//   completed: boolean;
//   subdeadline: number; // 保持与其他组件兼容的number类型
//   updatedAt: number;
// }

// interface MainPlan {
//   planid: number;
//   plantitle: string;
//   description: string;
//   createdAt: number;
//   deadline: number;
//   subItems: SubItem[];
// }

const StudyPlan: React.FC = () => {
  // 状态提升：将主计划状态移至index组件管理
  // 初始化主计划数据
// 初始化主计划数据
const [mainPlans, setMainPlans] = useState<MainPlan[]>([
  {
    planid: 1,
    plantitle: "前端学习计划",
    description: "掌握React和TypeScript开发",
    createdAt: Date.now(),
    deadline: dayjs().add(30, 'day').valueOf(),
    subItems: [
      {
        subid: 1001,
        subtitle: '学习React基础',
        description: '掌握React组件、状态和属性',
        completed: false,
        subdeadline: dayjs().add(7, 'day').valueOf(),
        updatedAt: Date.now(),
      },
      {
        subid: 1002,
        subtitle: '学习TypeScript',
        description: '掌握TypeScript类型系统和接口',
        completed: false,
        subdeadline: dayjs().add(14, 'day').valueOf(),
        updatedAt: Date.now(),
      },
    ]
  },
  {
    planid: 2,
    plantitle: "前端进阶计划",
    description: "深入学习React高级特性",
    createdAt: Date.now(),
    deadline: dayjs().add(45, 'day').valueOf(),
    subItems: [
      {
        subid: 2001,
        subtitle: '学习React Hooks',
        description: '掌握useState、useEffect等Hooks',
        completed: true,
        subdeadline: dayjs().subtract(3, 'day').valueOf(),
        updatedAt: Date.now(),
      },
      {
        subid: 2002,
        subtitle: '学习Redux',
        description: '掌握状态管理库Redux',
        completed: false,
        subdeadline: dayjs().add(21, 'day').valueOf(),
        updatedAt: Date.now(),
      },
    ]
  }
]);

  //以下内容完全是为了不报错进行的修改，实际功能没有实现
  const handlemainplanitemChange = (newmainplan: MainPlan[]) => {
    setMainPlans(newmainplan);
  };

  async function handleSubmit(values: any): Promise<any> {
    try {
      const res: any = await studyplan({ ...values });
      console.log(res)
      const { id,nickname,foudlist } = res;
      if(id !== undefined){
        setMainPlans(res)
      }
      
    } catch (error: any) {
      // 如果失败替换为默认列表
      console.log(error)
      // setdata(defaultdata)
    }
  };

  useEffect(() => {
    handleSubmit(mainPlans); // 将 handleSubmit 放在 useEffect 中
  }, []); // 空依赖数组确保只在挂载时运行一次
  useEffect(() => {
    // 当data.foudlist发生变化时，更新items
    if (Array.isArray(mainPlans)) {

      // setItems(convertfoudlistToListItems(data.foudlist|| []));

    }
  }, [mainPlans]); 

  //以上内容完全是为了不报错进行的修改，实际功能没有实现

//     // 处理主计划项变化的回调函数
// const handleMainPlanItemChange = (newMainPlans: MainPlan[]) => {
//   setMainPlans(newMainPlans);
// };

// // 初始化获取数据
// useEffect(() => {
//   // 实际项目中可以在这里调用API获取数据
//   // 这里使用模拟数据
//   console.log('StudyPlan component initialized');
// }, []);






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
            mainplanitem={mainPlans}
            onmainplanitemChange={handlemainplanitemChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;