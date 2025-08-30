import { request } from '@umijs/max';
import { gql } from 'graphql-tag';

// 导入PlanList接口
export interface PlanList {
  username?: string;
  mainplans?: number[];
}

export async function Planlist(body: PlanList) {
  // 注意这是一个拼接字符串的实例,
  //.query 后是 gql 查询的的名字，在 schema 中定义
  // 这个输出展示了查询的结构，但不会直接把 loginName 和 loginPassword 的值替换进去。
  const query = gql`
    query usergetPlanlist($params: PlanList) {
      usergetPlanlist(params: $params) {
        mainplans
      }
    }
  `;

  // 实际的请求发送时，GraphQL 客户端会自动将 variables 中的值注入到查询中
  const variables = {
    params: {
      username: body.username,
    },
  };

  const data = {
    query: query.loc?.source.body,
    operationName: 'usergetPlanlist', // 操作名称，选填，查询文档有多个操作时必填
    variables, // 对象集合，选填
  };

  // 打印请求数据以便调试
  console.log('Planlist request data:', data);

  return request<API.ResponseData>('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  })
    .then((response) => {
      // 打印响应数据以便调试
      console.log('Planlist response:', response);
      return response.data.usergetPlanlist;
    })
    .catch((error) => {
      console.error('Planlist request failed:', error);
      // 提供更详细的错误信息
      throw new Error(`获取计划数据失败: ${error.message || '未知错误'}`);
    });
}

export async function SavePlanlist({
  username,
  planlist,
}: {
  username?: string;
  planlist?: number[];
}) {
  // 定义 GraphQL 变量
  const variables = {
    input: {
      username,
      planlist,
    },
  };

  // 定义 GraphQL Mutation
  const mutation = gql`
    mutation userSavePlanlist($input: SavePlanlistInput!) {
      userSavePlanlist(input: $input)
    }
  `;

  // 构造请求体
  const data = {
    query: mutation.loc?.source.body, // 获取 GraphQL 查询的 body
    operationName: 'userSavePlanlist', // 操作名称，选填，查询文档有多个操作时必填
    variables, // 变量集合
  };

  // console.log(data);
  // 使用 request 发送请求
  return request<API.ResponseData>('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  })
    .then((response) => {
      if (response.success && response.data.userSavePlanlist) {
        return true; // 返回布尔值，表示保存成功
      }
      throw new Error(response.errorMessage || '列表保存失败');
    })
    .catch((error) => {
      console.error('Planlist save failed:', error);
      throw error; // 返回错误信息
    });
}
