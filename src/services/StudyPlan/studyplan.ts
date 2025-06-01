import { request } from '@umijs/max';
import { gql } from 'graphql-tag';

export async function studyplan(body:MainPlan) {
  // 注意这是一个拼接字符串的实例,
  //.query 后是 gql 查询的的名字，在 schema 中定义
  // 这个输出展示了查询的结构，但不会直接把 loginName 和 loginPassword 的值替换进去。
  const query = gql`
    query usergetStudyplan($params: MainPlan) {
      usergetStudyplan(params: $params)
    }
  `;

  // 实际的请求发送时，GraphQL 客户端会自动将 variables 中的值注入到查询中
  const variables = {
    params: {
      accountid:body.planid,
    },
  };

  const data = {
    query: query.loc?.source.body,
    operationName: 'usergetStudyplan', // 操作名称，选填，查询文档有多个操作时必填
    variables, // 对象集合，选填
  };

  return request<API.ResponseData>('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    // ...(options || {}),
  })
    .then((response) => {
      // response 中包含了 account 和 token
      // if (response.success) {
      // 只有在账号登陆时，才会生成新的 token
      // 把 account 返回
      return response.data.usergetStudyplan;
      // }
      // throw new Error('无效的后台反馈，登录失败');
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error.message);
    });
}


// export async function resetFoudlist({id,foudlist,}: {id: number;foudlist: string;}){
//   // 定义 GraphQL 变量
//   const variables = {
//     input: {
//       id,
//       foudlist,
//     },

//     };
// {
//   // 定义 GraphQL Mutation
//   const mutation = gql`
//     mutation userResetFoudlist($input: ResetFoudlistInput!) {
//       userResetFoudlist(input: $input)
//     }
//   `;

//   // 构造请求体
//   const data = {
//     query: mutation.loc?.source.body, // 获取 GraphQL 查询的 body
//     operationName: 'userResetFoudlist', // 操作名称，选填，查询文档有多个操作时必填
//      variables, // 变量集合
//   }

//   // console.log(data);
//   // 使用 request 发送请求
//   return request<API.ResponseData>('/graphql', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     data,
//   })
//     .then((response) => {
//       if (response.success && response.data.userResetFoudlist) {
//         return true; // 返回布尔值，表示重置成功
//       }
//       throw new Error(response.errorMessage || '列表保存失败');
//     })
//     .catch((error) => {
//       console.error('Password reset failed:', error);
//       throw error; // 返回错误信息
//     });
// }
// }
