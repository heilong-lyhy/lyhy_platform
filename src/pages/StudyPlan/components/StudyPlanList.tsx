import React from 'react';
import { List, Button, Form, Input, Modal,DatePicker } from 'antd';
import StudyPlanTable from './StudyPlanTable';
import dayjs from 'dayjs';
import './StudyPlanList.less';
// import StudyPlanCalendar from './StudyPlanCalendar';


const { RangePicker } = DatePicker;
// 主计划数据结构

// 由于 onmainplanitemChange 未被使用，根据提示移除该参数
interface StudyPlanProps {
  mainplanitem: MainPlan[];
  onmainplanitemChange: (newMainPlans: MainPlan[]) => void;
}

const StudyPlanList: React.FC<StudyPlanProps> = ({ mainplanitem, onmainplanitemChange }) => {
  const handleSubItemChange = (planId: number, newSubItems: SubItem[]) => {
    const newMainPlans = mainplanitem.map(plan => 
      plan.planid === planId ? { ...plan, subItems: newSubItems } : plan
    );
    onmainplanitemChange(newMainPlans);
  };
  // 使用父组件传递的mainplanitem作为当前数据
  const [localMainPlans, setLocalMainPlans] = React.useState<MainPlan[]>(mainplanitem);
  // 同步父组件props到本地状态
  React.useEffect(() => {
    setLocalMainPlans(mainplanitem);
  }, [mainplanitem]);
  // const [mainPlans, setMainPlans] = React.useState<MainPlan[]>([
  //   {
  //     id: 1,
  //     title: "前端学习计划",
  //     description: "掌握React和TypeScript开发",
  //     createdAt: dayjs(),
  //     deadline: dayjs().add(30, 'day'),
  //     subItems: [
  //       { id: 1, title: "学习React基础", completed: true },
  //       { id: 2, title: "掌握TypeScript", completed: false }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     title: "前端学习计划",
  //     description: "掌握React和TypeScript开发",
  //     createdAt: dayjs(),
  //     deadline: dayjs().add(30, 'day'),
  //     subItems: [
  //       { id: 1, title: "学习React基础", completed: true },
  //       { id: 2, title: "掌握TypeScript", completed: false }
  //     ]
  //   }
  // ]);

  const [isEditMode, setIsEditMode] = React.useState(false);
  const [newPlanVisible, setNewPlanVisible] = React.useState(false);
  const [form] = Form.useForm();
  
  const handleCreate = (values: any) => {
    const newPlan = {
      planid: Math.max(...localMainPlans.map(p => p.planid)) + 1,
      plantitle: values.title,
      description: values.description,
      createdAt: values.timeRange[0],
      deadline: values.timeRange[1],
      subItems: []
    };
    setLocalMainPlans([...localMainPlans, newPlan]);
    setNewPlanVisible(false);
    form.resetFields();
  };

  // const handleValueChange = (newValue: MainPlan[]) => {
  //   setMainPlans(newValue);
  // };
  // const handleSubItemsChange = (newSubItems: SubItem[]) => {
  //   setMainPlans(prev => ({
  //     ...prev, // 保留其他字段
  //     subItems: newSubItems // 仅更新 subItems
  //   }));
  // };
  
  const handleDelete = (planId: number) => {
    setLocalMainPlans(localMainPlans.filter(p => p.planid !== planId));
  };

  return (
    <div className="main-plan-list">
      <Button 
        type="primary" 
        style={{ marginBottom: 16 }}
        onClick={() => setIsEditMode(!isEditMode)}
      >
        {isEditMode ? '退出编辑' : '编辑所有计划'}
      </Button>
      {isEditMode && (
        <Button
          type="primary"
          onClick={() => setNewPlanVisible(true)}
        >
          新建计划
        </Button>
      )}
      <Modal
        title="新建学习计划" 
        visible={newPlanVisible}
        onCancel={() => setNewPlanVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreate}>
          <Form.Item
            label="计划标题"
            name="title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="计划描述"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item 
            label="时间范围"
            name="timeRange"
            rules={[
            { required: true, message: '请选择时间范围' },
            {
              validator(_, value) {
                if (!value || value[0].isAfter(value[1])) {
                  return Promise.reject(new Error('结束时间必须晚于开始时间'));
                }
                return Promise.resolve();
              },
            },
          ]}
          >
            <RangePicker showTime />
          </Form.Item>
        </Form>
      </Modal>
      <List
        itemLayout="vertical"
        dataSource={localMainPlans}
        renderItem={plan => (
          <List.Item
            key={plan.planid}
            extra={
              <div style={{ minWidth: 120 }}>
                <p>创建时间: {dayjs(plan.createdAt).format('YYYY-MM-DD')}</p>
                <p>截止时间: {dayjs(plan.deadline).format('YYYY-MM-DD')}</p>
                {isEditMode && (
                  <Button
                    danger
                    style={{ marginTop: 8 }}
                    onClick={() => {
                      Modal.confirm({
                        title: '确认删除',
                        content: '确定要删除该学习计划吗？',
                        onOk: () => handleDelete(plan.planid)
                      });
                    }}
                  >
                    删除
                  </Button>
                )}
              </div>
            }
          >
            <List.Item.Meta
              title={<h3>{plan.plantitle}</h3>}
              description={plan.description}
            />
            
            <div style={{ marginTop: 16 }}>
              <span style={{ color: '#1890ff' }}>当前任务: </span>
              {plan.subItems.find(item => !item.completed)?.subtitle || '暂无待办任务'}
            </div>
            
            {/* 嵌套子项表格 */}
            <StudyPlanTable 
            items={plan.subItems} 
            onSubItemChange={(newSubItems) => handleSubItemChange(plan.planid, newSubItems)}
            // onValueChange={handleSubItemsChange}
          />
          </List.Item>
        )}
      />
    </div>
  );
};





export default StudyPlanList;