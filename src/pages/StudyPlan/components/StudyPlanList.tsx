import React from 'react';
import { List, Button, Form, Input, Modal,DatePicker } from 'antd';
import StudyPlanTable from './StudyPlanTable';
import dayjs from 'dayjs';
import './StudyPlanList.less';


const { RangePicker } = DatePicker;
// 主计划数据结构

const StudyPlanList: React.FC = () => {
  const handleSubItemChange = (planId: number, newSubItems: SubItem[]) => {
    setMainPlans(mainPlans.map(plan => 
      plan.id === planId ? { ...plan, subItems: newSubItems } : plan
    ));
  };
  // 示例主计划数据
  const [mainPlans, setMainPlans] = React.useState<MainPlan[]>([
    {
      id: 1,
      title: "前端学习计划",
      description: "掌握React和TypeScript开发",
      createdAt: dayjs(),
      deadline: dayjs().add(30, 'day'),
      subItems: [
        {
          id: 624748504,
          title: '活动名称一',
          readonly: '活动名称一',
          description: '这个活动真好玩',
          completed: false,
          createdAt: 1590486176000,
          updatedAt: 1590486176000,
        },
        {
          id: 624691229,
          title: '活动名称二',
          readonly: '活动名称二',
          description: '这个活动真好玩',
          completed: false,
          createdAt: 1590481162000,
          updatedAt: 1590481162000,
        },
      ]
    },
    {
      id: 2,
      title: "前端学习计划2",
      description: "掌握React和TypeScript开发",
      createdAt: dayjs(),
      deadline: dayjs().add(30, 'day'),
      subItems: [
        {
          id: 624748504,
          title: '活动名称一',
          readonly: '活动名称一',
          description: '这个活动真好玩',
          completed: true,
          createdAt: 1590486176000,
          updatedAt: 1590486176000,
        },
        {
          id: 624691229,
          title: '活动名称二',
          readonly: '活动名称二',
          description: '这个活动真好玩',
          completed: false,
          createdAt: 1590481162000,
          updatedAt: 1590481162000,
        },
      ]
    }
  ]);
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
      id: Math.max(...mainPlans.map(p => p.id)) + 1,
      title: values.title,
      description: values.description,
      createdAt: dayjs(values.timeRange[0]),
      deadline: dayjs(values.timeRange[1]),
      subItems: []
    };
    setMainPlans([...mainPlans, newPlan]);
    setNewPlanVisible(false);
    form.resetFields();
  };
  
  const handleDelete = (planId: number) => {
    setMainPlans(mainPlans.filter(p => p.id !== planId));
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
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || value[0].isAfter(value[1])) {
                return Promise.reject(new Error('结束时间必须晚于开始时间'));
              }
              return Promise.resolve();
            },
          }),
        ]}
          >
            <RangePicker showTime />
          </Form.Item>
        </Form>
      </Modal>
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
                {isEditMode && (
                  <Button
                    danger
                    style={{ marginTop: 8 }}
                    onClick={() => {
                      Modal.confirm({
                        title: '确认删除',
                        content: '确定要删除该学习计划吗？',
                        onOk: () => handleDelete(plan.id)
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
              title={<h3>{plan.title}</h3>}
              description={plan.description}
            />
            
            <div style={{ marginTop: 16 }}>
              <span style={{ color: '#1890ff' }}>当前任务: </span>
              {plan.subItems.find(item => !item.completed)?.title || '暂无待办任务'}
            </div>
            
            {/* 嵌套子项表格 */}
            <StudyPlanTable 
            items={plan.subItems} 
            onSubItemChange={(newSubItems) => handleSubItemChange(plan.id, newSubItems)}
          />
          </List.Item>
        )}
      />
    </div>
  );
};





export default StudyPlanList;