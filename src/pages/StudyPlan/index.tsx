import { Planlist, SavePlanlist } from '@/services/StudyPlan/planlist';
import { useModel } from '@umijs/max';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import StudyPlanCalendar from './components/StudyPlanCalendar';
import StudyPlanList from './components/StudyPlanList';
import './index.less';

const StudyPlan: React.FC = () => {
  // 状态提升：将主计划状态移至index组件管理
  // 初始化主计划数据
  // 初始化主计划数据
  const { initialState } = useModel('@@initialState');
  const currentUsername = initialState?.currentUser?.name;
  console.log(currentUsername);

  // 显式定义setMainPlans的类型，确保它接受MainPlan[]类型
  const [mainplans, setMainPlans] = useState<MainPlan[]>([
    {
      planid: 1,
      plantitle: '前端学习计划',
      description: '掌握React和TypeScript开发',
      createdAt: dayjs(),
      deadline: dayjs().add(30, 'day'),
      subItems: [
        {
          subid: 1001,
          subtitle: '学习React基础',
          description: '掌握React组件、状态和属性',
          completed: false,
          subdeadline: dayjs().add(7, 'day'),
          updatedAt: dayjs(),
        },
        {
          subid: 1002,
          subtitle: '学习TypeScript',
          description: '掌握TypeScript类型系统和接口',
          completed: false,
          subdeadline: dayjs().add(14, 'day'),
          updatedAt: dayjs(),
        },
      ],
    },
    {
      planid: 2,
      plantitle: '前端进阶计划',
      description: '深入学习React高级特性',
      createdAt: dayjs(),
      deadline: dayjs().add(45, 'day'),
      subItems: [
        {
          subid: 2001,
          subtitle: '学习React Hooks',
          description: '掌握useState、useEffect等Hooks',
          completed: true,
          subdeadline: dayjs().subtract(3, 'day'),
          updatedAt: dayjs(),
        },
        {
          subid: 2002,
          subtitle: '学习Redux',
          description: '掌握状态管理库Redux',
          completed: false,
          subdeadline: dayjs().add(21, 'day'),
          updatedAt: dayjs(),
        },
      ],
    },
  ]);
  const [data, setdata] = useState<PlanList>({
    username: currentUsername,
    mainplans: mainplans,
  });
  //创建data，用于进行后端数据传输，包含用户名和主计划列表。但接下来的更新都将基于mainplans进行。

  // const handleplanlistChange = (newplanlist: number[]) => {
  //   setdata({username: currentUsername, mainplans:newplanlist});
  // };
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
  // 将各种格式的时间转换为dayjs对象
  const convertTimeStringsToDayjs = (plans: any[]): MainPlan[] => {
    return plans.map((plan) => {
      // 转换主计划的时间字段 - 对任何非null/undefined的时间值都尝试转换
      const convertedPlan: MainPlan = {
        ...plan,
        createdAt: plan.createdAt ? dayjs(plan.createdAt) : dayjs(),
        deadline: plan.deadline ? dayjs(plan.deadline) : dayjs().add(30, 'day'),
        subItems: [],
      };

      // 转换子计划的时间字段 - 改进处理逻辑，对任何非null/undefined的时间值都尝试转换
      if (Array.isArray(plan.subItems)) {
        convertedPlan.subItems = plan.subItems.map((subItem: any) => ({
          ...subItem,
          subdeadline: subItem.subdeadline ? dayjs(subItem.subdeadline) : undefined,
          updatedAt: subItem.updatedAt ? dayjs(subItem.updatedAt) : dayjs(),
        }));
      }

      return convertedPlan;
    });
  };

  async function handleplanlistSubmit(username: string | undefined): Promise<void> {
    try {
      // 根据username查询完整的mainplan数据（不再需要二次查询）
      const planListRes: any = await Planlist({ username });
      console.log('这是planListRes', { planListRes });

      if (Array.isArray(planListRes) && planListRes.length > 0) {
        // 将后端返回的字符串格式时间转换为dayjs对象
        const convertedPlans = convertTimeStringsToDayjs(planListRes);
        setMainPlans(convertedPlans);
        setdata({ username, mainplans: convertedPlans });
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

  //处理主计划项变化的回调函数
  const handlemainplanitemChange = async (newmainplan: MainPlan[]) => {
    setMainPlans(newmainplan);
    setdata({ username: currentUsername, mainplans: newmainplan });
    console.log(data, mainplans);
    try {
      // 修复类型错误：将MainPlan[]转换为number[]（planid数组）
      const res: any = await SavePlanlist({
        username: currentUsername,
        planlist: newmainplan.map((item) => item.planid),
      });
      if (res === false) {
        console.log('保存失败');
      } else {
        console.log('保存成功');
      }
    } catch (error) {
      console.log(error);
    }
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

  // 移除错误的useEffect钩子，它违反了PlanList类型定义
  // 主计划数据应该保持为MainPlan[]类型，不应该转换为number[]

  useEffect(() => {
    // 当mainplans发生变化时，可以在这里执行其他操作
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
    <div className="main">
      <div className="main-native">
        {/* 日历组件：传递所有主计划的subItems合并数组 */}
        <div className="studyplancalendar">
          <StudyPlanCalendar items={mainplans.flatMap((plan) => plan.subItems)} />
        </div>

        {/* 列表组件：传递主计划数据和更新回调 */}
        <div className="studyplanlist">
          <StudyPlanList mainplanitem={mainplans} onmainplanitemChange={handlemainplanitemChange} />
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;
