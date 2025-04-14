import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, List } from 'antd';
import { resetFoudlist } from '@/services/Lunch/lunch';
import { useIntl, useModel } from '@umijs/max';

const ModalListComponent: React.FC<ModalListComponentProps> = ({ open , onClose , foudlist }) => {
  //用来将传来的foudlist转换成ListItem的格式
  const foudlistInitial = foudlist //用于保存初始值以用于取消时恢复
  const [items, setItems] = useState<ListItem[]>(foudlist);
  const [inputValue, setInputValue] = useState<string>('');
    const { initialState } = useModel('@@initialState');
    const currentUserid = initialState?.currentUser?.id;
  const intl = useIntl();
  
  useEffect(() => {
    setItems(foudlist);
  }, [foudlist]); // 当foudlist发生变化时，更新items

  const handleAdd = () => {
    if (inputValue.trim()) {
      setItems([...items, { foudid: items.length + 1, foudname: inputValue }]);
      setInputValue('');//这个函数被触发后将会在当前item的基础上新增一个条目用于储存当前input框中的内容
    }
  };
  const extractNames = (foudlist: { foudid: number, foudname: string }[]): string[] => {
    return foudlist.map(item => item.foudname);
  };//用于将foudlist转换成一个字符串数组，用于显示当前列表中的条目

  const handleDelete = (key: number) => {
    setItems(items.filter(item => item.foudid !== key));
  };//用于删除指定的列表中的条目，具体实现效果以后再写

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);//这将用来检测input框内的变化情况
  };

  const handlechangeback = () =>{
    onClose(foudlistInitial)
    setItems(foudlistInitial)
    //点击取消按钮后，将foudlist恢复为初始值，并将当前列表中的条目一并恢复
  }
  const handlechangecommit = async () =>{
    const savefoudlist = JSON.stringify(extractNames(items));
    console.log(savefoudlist);
    //bug记录：在返回数组时，会出现与预想的格式不同的问题，鉴定为屎山代码问题。
    //在实际进行数组的删除后会出现列表中有额外消失的列表项，问题与上方同源
    //解决方案：最好是修改全部的foudlist格式，从根源上解决问题。

    onClose(items)
    if (currentUserid === undefined) {
      console.log(intl.formatMessage({ id: 'lunch.component.console.iderr' }));
      return; // 或者其他适当的错误处理
  }
    try {
    const res: any = await resetFoudlist({ id: currentUserid, foudlist: savefoudlist });
    if (res === false) {
      console.log(intl.formatMessage({ id: 'lunch.component.console.commiterr' }));
    } else {
      console.log(intl.formatMessage({ id: 'lunch.component.console.commitok' }));
    }
    // console.log(items)
    // console.log(savefoudlist)
    //点击提交按钮后，将当前列表中的条目提交，并关闭弹窗
  }catch (error) {
    console.log(error)
  }
  } 
  
  return (
    <Modal
      // title="Foud List"
      title={intl.formatMessage({ id: 'lunch.component.list.title' })+foudlist.length}
      open={open}//原本预定使用visible，后面发现被弃用了，故更为open
      onCancel={handlechangeback}
      onOk={handlechangecommit}
      footer={[
        <Button key="back" onClick={handlechangeback}>
          {intl.formatMessage({ id: 'lunch.component.list.cancel' })}
        </Button>,
        <Button key="submit" type="primary" onClick={handlechangecommit}>
          {intl.formatMessage({ id: 'lunch.component.list.submit' })}
        </Button>,
      ]}
    >
      <Input
        placeholder="Enter item"
        value={inputValue}
        onChange={handleInputChange}
        onPressEnter={handleAdd}//当有人选中input框按下回车便会触发handleAdd函数
        style={{ marginBottom: 16, width: '100%' }}
      />
      <List
        bordered
        dataSource={items}
        renderItem={item => (
          <List.Item>
            {item.foudname}
            <Button onClick={() => handleDelete(item.foudid)} style={{ marginLeft: 8 }} danger>
              {intl.formatMessage({ id: 'lunch.component.list.delete' })}
            </Button>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default ModalListComponent;