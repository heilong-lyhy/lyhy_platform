import type { ProColumns } from '@ant-design/pro-components';
import {
  EditableProTable,
  ProCard,
  ProFormField,
  ProFormRadio,
} from '@ant-design/pro-components';
import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import dayjs from 'dayjs';



const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// const defaultData: DataSourceType[] = [
//   {
//     id: 624748504,
//     title: '活动名称一',
//     readonly: '活动名称一',
//     decs: '这个活动真好玩',
//     state: 'open',
//     created_at: 1590486176000,
//     update_at: 1590486176000,
//   },
//   {
//     id: 624691229,
//     title: '活动名称二',
//     readonly: '活动名称二',
//     decs: '这个活动真好玩',
//     state: 'closed',
//     created_at: 1590481162000,
//     update_at: 1590481162000,
//   },
// ];



const StudyPlanTable: React.FC<TableProps> = ({ items, onSubItemChange }) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>(
    'bottom',
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   onValueChange();
  // };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ProColumns<SubItem>[] = [
    {
      title: '计划名',
      dataIndex: 'subtitle',
      // tooltip: '只读，使用form.getFieldValue获取不到值',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
      editable: (text, record, index) => {
        return true;
      },
      width: '15%',
    },

    {
      title: '完成状态',
      key: 'completed',
      dataIndex: 'completed',
      valueType: 'select',
      valueEnum: {
        // all: { text: '全部', status: 'Default' },
        false: {
          text: '未解决',
          status: 'Error',
        },
        true: {
          text: '已解决',
          status: 'Success',
        },
      },
    },
    {
      title: '描述',
      width: '30%',
      dataIndex: 'description',
      fieldProps: (form, { rowKey, rowIndex }) => {
        if (form.getFieldValue([rowKey || '', 'title']) === '不好玩') {
          return {
            disabled: true,
          };
        }
        if (rowIndex > 9) {
          return {
            disabled: true,
          };
        }
        return {};
      },
    },
    {
      title: '预期结束时间',
      dataIndex: 'subdeadline',
// 根据错误提示，`valueType` 需要合适的类型，`date` 是 `ProFieldValueType` 中合适的类型
      valueType: 'date',
      // render: (text) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.subid);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            const newItems = items.filter((item) => item.subid !== record.subid);
            onSubItemChange(newItems);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <>
      <Button type="primary" onClick={showModal}>
        查看详情
      </Button>
      <Modal
        title="学习计划日程表"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="80%"
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <EditableProTable<SubItem>
          rowKey="subid"
          headerTitle="在这编辑你的具体计划吧"
          maxLength={5}
          value={items}
          onChange={(newItems) => onSubItemChange(newItems as SubItem[])}
          scroll={{
            x: 960,
          }}
          recordCreatorProps={
            position !== 'hidden'
              ? {
                  position: position as 'top',
                  record: () => ({ subid: (Math.random() * 1000000).toFixed(0) }),
                }
              : false
          }
          loading={false}
          toolBarRender={() => [
            <ProFormRadio.Group
              key="render"
              fieldProps={{
                value: position,
                onChange: (e) => setPosition(e.target.value),
              }}
              options={[
                {
                  label: '添加到顶部',
                  value: 'top',
                },
                {
                  label: '添加到底部',
                  value: 'bottom',
                },
                {
                  label: '隐藏',
                  value: 'hidden',
                },
              ]}
            />,
          ]}
          columns={columns}
          request={async () => ({
            data: items,
            total: 3,
            success: true,
          })}
          // value={items}
          // onChange={(value) => {
          //   setDataSource([...value]); // 使用扩展运算符将只读数组转换为可变数组
          // }}
          editable={{
            type: 'multiple',
            editableKeys,
            onSave: async (rowKey, data, row) => {
              console.log(rowKey, data, row);
              await waitTime(2000);
            },
            onChange: setEditableRowKeys,
          }}
        />
        {/* <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
          <ProFormField
            ignoreFormItem
            fieldProps={{
              style: {
                width: '100%',
              },
            }}
            mode="read"
            valueType="jsonCode"
            text={JSON.stringify(dataSource)}
          />
        </ProCard> */}
      </Modal>
    </>
  );
};
//以上内容为表格数据展示，实际使用中可以不展示
export default StudyPlanTable;
