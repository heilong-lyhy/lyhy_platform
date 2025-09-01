import { request } from '@umijs/max';
import { gql } from 'graphql-tag';

// 导入PlanList接口

export async function Planlist(body: PlanList) {
  // 注意这是一个拼接字符串的实例,
  //.query 后是 gql 查询的的名字，在 schema 中定义
  // 这个输出展示了查询的结构，但不会直接把 loginName 和 loginPassword 的值替换进去。
  const query = gql`
    query usergetPlanlist($params: PlanListInput!) {
      usergetPlanlist(params: $params) {
        mainplans {
          planid
          plantitle
          description
          createdAt
          deadline
          subItems {
            subid
            subtitle
            description
            completed
            subdeadline
            updatedAt
          }
        }
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
      return response.data?.usergetPlanlist?.mainplans || [];
    })
    .catch((error) => {
      console.error('Planlist request failed:', error);
      // 提供更详细的错误信息
      throw new Error(`获取计划数据失败: ${error.message || '未知错误'}`);
    });
}

// 定义保存计划的接口

export async function SavePlanlist({
  username,
  userid,
  planData,
}: {
  username?: string;
  userid?: number;
  planData?: MainPlan[]; // 修改为数组类型
}) {
  // 如果提供了planData，则使用新的保存方式
  if (!planData || !planData.length) {
    throw new Error('缺少有效的计划数据');
  }

  // 在SavePlanlist函数内部，添加数据类型转换逻辑
  // 构造请求体前，先处理planData中的类型转换
  const processedPlanData = planData.map((plan) => ({
    ...plan,
    subItems: plan.subItems.map((item) => ({
      subid: String(parseInt(item.subid as string, 10)),
      subtitle: item.subtitle,
      description: item.description,
      completed:
        typeof item.completed === 'string'
          ? (item.completed as string).toLowerCase() === 'true'
          : item.completed,
      subdeadline: item.subdeadline,
      // 移除updatedAt字段，因为SubItemInput类型中没有定义这个字段
    })),
  }));

  // 定义 GraphQL 变量
  const variables = {
    input: {
      username,
      userid,
      planData: processedPlanData,
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

  // 打印请求数据以便调试
  console.log('SavePlanlist request data:', data);

  // 使用 request 发送请求
  return request<API.ResponseData>('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  })
    .then((response) => {
      console.log('SavePlanlist response:', response);
      if (response.data?.userSavePlanlist) {
        return true; // 返回布尔值，表示保存成功
      }
      throw new Error(response.errorMessage || '计划保存失败');
    })
    .catch((error) => {
      console.error('Planlist save failed:', error);
      throw error; // 返回错误信息
    });
}
