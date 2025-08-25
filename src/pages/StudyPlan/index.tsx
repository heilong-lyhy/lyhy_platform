import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import StudyPlanCalendar from './components/StudyPlanCalendar';
import StudyPlanList from './components/StudyPlanList';
import { Studyplan } from '@/services/StudyPlan/studyplan';
import './index.less';
import { useModel } from '@umijs/max';
import { Planlist } from '@/services/StudyPlan/planlist';


const StudyPlan: React.FC = () => {
  // 状态提升：将主计划状态移至index组件管理
  // 初始化主计划数据
// 初始化主计划数据
  const { initialState } = useModel('@@initialState');
  const currentUsername = initialState?.currentUser?.name;
  console.log(currentUsername);

  const [mainplans, setMainPlans] = useState<MainPlan[]>([
  {
    planid: 1,
    plantitle: "前端学习计划",
    description: "掌握React和TypeScript开发",
    createdAt: dayjs(),
    deadline: dayjs().add(30, 'day'),
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
    createdAt: dayjs(),
    deadline: dayjs().add(45, 'day'),
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
  const [data, setdata] = useState<PlanList>({username: currentUsername, mainplans:mainplans});
//创建data，用于进行后端数据传输，包含用户名和主计划列表。但接下来的更新都将基于mainplans进行。

  const handleplanlistChange = (newplanlist: []) => {
    setdata({username: currentUsername, mainplans:newplanlist});
  };
  // async function handleplanlistSubmit(values: any): Promise<any> {
  //   try {
  //     const res: any = await Planlist({ ...values });
  //     const { username,planlist } = res;
  //     console.log(res)
  //     console.log(username,planlist)
  //     if(username !== undefined){
  //       setdata(res)
  //     }
      
  //   } catch (error: any) {
  //     // 如果失败替换为默认列表
  //     console.log(error)
  //     // setdata(defaultdata)
  //   }
  // };
  async function handleplanlistSubmit(username: string | undefined): Promise<void> {
  try {
    // 第一步：根据username查询planid列表
    const planListRes: any = await Planlist({ username });
    const { planlist: planIds } = planListRes;

    if (Array.isArray(planIds) && planIds.length > 0) {
      // 第二步：根据planid列表查询完整的mainplan数据
      const mainPlansRes: any = await Studyplan({ planids: planIds });
      setMainPlans(mainPlansRes);
      setdata({ username, mainplans: mainPlansRes });
    } else {
      // 没有找到计划，设置为空数组
      setMainPlans([]);
      setdata({ username, mainplans: [] });
    }
  } catch (error: any) {
    console.error('获取计划数据失败:', error);
    // 错误处理逻辑
  }
}


  //以下内容完全是为了不报错进行的修改，实际功能没有实现
  const handlemainplanitemChange = (newmainplan: MainPlan[]) => {
    setMainPlans(newmainplan);
    console.log(newmainplan)
  };

  // async function handleSubmit(values: any): Promise<any> {
  //   try {
  //     const res: any = await studyplan({ ...values });
  //     const { id,nickname,foudlist } = res;
  //     console.log(res)
  //     console.log(id,nickname,foudlist)
  //     if(id !== undefined){
  //       setMainPlans(res)
  //     }
      
  //   } catch (error: any) {
  //     // 如果失败替换为默认列表
  //     console.log(error)
  //     // setdata(defaultdata)
  //   }
  // };

  // useEffect(() => {
  //   handleplanlistSubmit(currentUsername); // 将 handleSubmit 放在 useEffect 中
  // }, []); // 空依赖数组确保只在挂载时运行一次
  useEffect(() => {
  if (currentUsername) {
    handleplanlistSubmit(currentUsername);
  }
}, [currentUsername]);

  useEffect(() => {
  setdata(prev => ({ ...prev, mainplans }));
}, [mainplans]);

  useEffect(() => {
    // 当data.mainplans发生变化时，更新,但是目前不弄
    if (Array.isArray(mainplans)) {
      // setItems(convertfoudlistToListItems(data.foudlist|| []));
    }
  }, [mainplans]); 

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
          <StudyPlanCalendar items={mainplans.flatMap(plan => plan.subItems)} />
        </div>
        
        {/* 列表组件：传递主计划数据和更新回调 */}
        <div className='studyplanlist'>
          <StudyPlanList 
            mainplanitem={mainplans}
            onmainplanitemChange={handlemainplanitemChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;