import React from 'react';
import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';


const StudyPlanCalendar: React.FC<StudyPlanCalendarProps> = ({ items }) => {
const getListData = (value: Dayjs) => {
  let listData: { type: string; content: string | undefined }[] = [];
  // 遍历subitems，筛选出subdeadline与当前日期匹配的项
  (items || []).forEach((item) => { // 处理items可能为undefined的情况
    const subdeadline = dayjs(item.subdeadline);
    // 检查subdeadline是否与当前日历日期同一天
    if (value.isSame(subdeadline, 'day')) {
      listData.push({
        type: item.completed ? 'success' : 'warning', // 根据完成状态设置类型
        content: item.subtitle // 显示任务标题
      });
    }
  });
  return listData;
};

// 定义一个名为 getMonthData 的函数，该函数接收一个 Dayjs 类型的参数 value
// 其作用是根据传入日期的月份来返回相应的数据
const getMonthData = (value: Dayjs) => {
  // 检查传入日期的月份是否为 8（在 JavaScript 中，月份从 0 开始计数，所以 8 代表 9 月）
  if (value.month() === 8) {
    // 如果月份为 8，则返回数字 1394
    return 1394;
  }
  // 如果月份不是 8，则函数默认返回 undefined
};

// 定义一个名为 StudyPlanCalendar 的 React 函数组件

  // 定义一个名为 monthCellRender 的函数，用于渲染日历中每个月的单元格
  // 该函数接收一个 Dayjs 类型的参数 value，表示当前单元格对应的日期
  const monthCellRender = (value: Dayjs) => {
    // 调用 getMonthData 函数，获取当前月份对应的数据
    const num = getMonthData(value);
    // 如果 getMonthData 函数返回了一个有效的数据（即不为 null 或 undefined）
    return num ? (
      // 则渲染一个带有类名 notes-month 的 div 元素
      <div className="notes-month">
        {/* 在 section 元素中显示获取到的数据 */}
        <section>{num}</section>
        {/* 在 span 元素中显示说明文字 "Backlog number" */}
        <span>Backlog number</span>
      </div>
    ) : null; // 如果没有有效数据，则返回 null，不渲染任何内容
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type as BadgeProps['status']} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  return <Calendar cellRender={cellRender} />;
};

export default StudyPlanCalendar;