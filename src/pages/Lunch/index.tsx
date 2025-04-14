import React, { useState, useEffect } from 'react';
// import React, { Children, useState } from 'react';
// import React, { useRef,useEffect } from 'react';
import { Button } from 'antd';
import './index.less';
import ModalListComponent from './components/ModalListComponent';
import { lunch } from '@/services/Lunch/lunch';
import { useIntl, useModel } from '@umijs/max';
// import { flushSync } from 'react-dom';

const Lunch: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUserid = initialState?.currentUser?.id;
  const [data, setdata] = useState<DataList>({id:currentUserid,nickname: 'guest', foudlist: ['宫保鸡丁', '麻婆豆腐', '糖醋排骨'] });
  const intl = useIntl();
  // const defaultdata = {accountid:currentUserid,nickname: 'guest', foudlist: ['宫保鸡丁', '麻婆豆腐', '糖醋排骨', '叉烧包', '小笼包'] }
  const convertfoudlistToListItems = (foudlist:string[]) =>{

    let fcfoudlist:ListItem[] = []
    // console.log(foudlist.length)
    //用于处理后台传来的foudlist数据，更改格式以用于前端显示
    for(let i=0 ; i<foudlist.length ; i++){
      fcfoudlist.push({foudid:i,foudname:foudlist[i]})
    }
    return fcfoudlist
  }
  const [items, setItems] = useState<ListItem[]>(convertfoudlistToListItems(data.foudlist|| []));

  async function handleSubmit(values: any): Promise<any> {
    try {
      const res: any = await lunch({ ...values });
      const { id,nickname,foudlist } = res;
      // const realfoudlist = JSON.parse(foudlist);
      // console.log(res)
      // console.log(currentUserid,id,nickname,foudlist)//暂时仅进行调用防止bug，后续进行修改
      // console.log(1,foudlist)
      if(id !== undefined){
        setdata({id,nickname,foudlist})
      }
      
    } catch (error: any) {
      // 如果失败替换为默认列表
      console.log(error)
      // setdata(defaultdata)
    }
  };
  
  useEffect(() => {
    handleSubmit(data); // 将 handleSubmit 放在 useEffect 中
  }, []); // 空依赖数组确保只在挂载时运行一次
  useEffect(() => {
    // 当data.foudlist发生变化时，更新items
    if (Array.isArray(data.foudlist)) {

      setItems(convertfoudlistToListItems(data.foudlist|| []));

    }
  }, [data.foudlist]); 


  // const newfoudlist:ListItem[] = convertfoudlistToListItems(foudlist)
  const [istext, setistext] = useState<string>(intl.formatMessage({id: 'lunch.main.what',defaultMessage: '什么'}));
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  // const [isclick, setisclick] = useState<boolean>(false);

    // let intervalId: number | undefined; // 定时器 ID

  const showModal = () => {
    setModalVisible(true);
  };

  // const handleOk = () => {
  //   setModalVisible(false);
  // };

  const handleCancel = async(newValue: ListItem[]) => {
    setLoading(true)
    try{
      await setItems(newValue);
      setModalVisible(false);
    }catch(error:any){
      console.log(error.message)
    }finally{
      setLoading(false)
    }
    // 可以在这里执行其他逻辑
  };


  let prevRandomIndex:number = -1
    function clicktime() {
      if (!loading) {
        if(items.length !== 0){
          //用于处理列表中只有一个选项的情况，防止报错
          if(items.length === 1){
            setistext(items[0].foudname)
            prevRandomIndex = 0
            // console.log('列表里只有一个项目')
          }else{
            let randomIndex;
            do {
              randomIndex = Math.floor(Math.random() * items.length);
            } while (randomIndex === prevRandomIndex); // 确保新索引与上一次不同
            const randomText = items[randomIndex].foudname; // 确保属性名正确
            setistext(randomText);
            console.log(randomText);
            // 更新上一次的索引值
            prevRandomIndex = randomIndex;
          }
        }else{
          alert(intl.formatMessage({id: 'lunch.list.error'}))
        }
      } else {
        console.log('Loading....');
      }
    }

//原本的列表操作代码，现已弃用，仅作为保留
  // const pushlist = () => {
  //   const newListItem = prompt('请输入新的列表项', '');
  //   if (newListItem) { // prompt 总是返回一个字符串，检查是否为空字符串
  //     setfoudlist([...foudlist, newListItem]); // 使用解构来避免直接修改状态
  //   }
  //   console.log(foudlist); // 注意：这里的 console.log 将显示旧状态，因为状态更新是异步的
  // };

  // const poplist = () => {
  //   const itemToRemove = prompt('请输入要删除的列表项', '');
  //   setfoudlist(foudlist.filter(item => item !== itemToRemove));
  //   console.log(foudlist); // 同样，这里的 console.log 将显示旧状态
  // };

  // const showlist = () => {
  //   alert(foudlist.join('\n')); // 将数组转换为字符串以在 alert 中显示
  //   console.log(foudlist);
  // };

  // const clearlist = () => {
  //   setfoudlist([]);
  //   console.log(foudlist); // 同样，这里的 console.log 将显示旧状态
  // };

  const caidan = () => {
    alert(intl.formatMessage({id: 'lunch.main.caidan'}));
    // const schoollist = ["麻辣香锅","鸡排饭","石锅拌饭"];
  };

  return(
    <>
    <div className="main">
      <div className='main-native'>
        <span className='s-title'>
          {intl.formatMessage({id: 'lunch.main.title',defaultMessage: '今天中午吃'})}
        </span>
          <h3 className='what'>{istext}</h3>
        <br/>
        <Button type="primary" onClick={clicktime}>{intl.formatMessage({id: 'lunch.btn.start',defaultMessage: '吃什么呢?'})}</Button>
        <Button type="primary" onClick={showModal}>
        {intl.formatMessage({id: 'lunch.list.showlist',defaultMessage: '显示当前列表'})}
        </Button>
        <ModalListComponent
        open={modalVisible}
        onClose={handleCancel}
        foudlist={items}
        />
        {/* <Button type="primary" onClick={pushlist}>添加列表项</Button>
        <Button type="primary" onClick={poplist}>删除列表项</Button>
        <Button type="primary" onClick={showlist}>显示当前列表</Button>
        <Button type="primary" onClick={clearlist}>清除列表</Button> */}
        <Button type="primary" onClick={caidan}>{data.nickname}</Button>
      </div>
    </div>
  </>
  );
}

export default Lunch;