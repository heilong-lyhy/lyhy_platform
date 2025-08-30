import { request } from '@umijs/max';
import { gql } from 'graphql-tag';

export async function Studyplan(body: { planid: number | number[] }) {
  // 注意这是一个拼接字符串的实例,
  //.query 后是 gql 查询的的名字，在 schema 中定义
  // 这个输出展示了查询的结构，但不会直接把 loginName 和 loginPassword 的值替换进去。
  const query = gql`
    query usergetStudyplan($params: MainPlanInput) {
      usergetStudyplan(params: $params) {
        planid
        plantitle
        description
        createdAt
        deadline
      }
    }
  `;

  // 如果是单个ID，直接请求
  if (typeof body.planid === 'number') {
    // 实际的请求发送时，GraphQL 客户端会自动将 variables 中的值注入到查询中
    // 虽然后端schema要求所有字段，但实际实现只需要planid
    // 为了通过GraphQL验证，我们提供所有必需字段的占位值
    const variables = {
      params: {
        planid: body.planid,
        plantitle: '',
        description: '',
        createdAt: '',
        deadline: '',
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
  // 如果是数组，批量请求
  else if (Array.isArray(body.planid)) {
    try {
      const promises = body.planid.map((planid) => {
        const variables = {
          params: {
            planid,
            plantitle: '',
            description: '',
            createdAt: '',
            deadline: '',
          },
        };

        const data = {
          query: query.loc?.source.body,
          operationName: 'usergetStudyplan',
          variables,
        };

        return request<API.ResponseData>('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data,
        })
          .then((response) => {
            return response.data.usergetStudyplan;
          })
          .catch((error) => {
            console.error(`获取计划ID: ${planid} 失败:`, error);
            return null; // 失败的计划返回null
          });
      });

      // 等待所有请求完成
      const results = await Promise.all(promises);
      // 过滤掉失败的结果
      return results.filter((plan) => plan !== null);
    } catch (error) {
      console.error('批量获取计划失败:', error);
      throw new Error('批量获取计划失败');
    }
  }
  throw new Error('planid参数必须是数字或数字数组');
}

export async function SaveStudyplan({
  username,
  planlist,
}: {
  username: string;
  planlist: number[];
}) {
  // 定义 GraphQL 变量
  const variables = {
    input: {
      username,
      mainplans: planlist,
    },
  };

  // 定义 GraphQL Mutation
  const mutation = gql`
    mutation userResetPlanlist($input: PlanList!) {
      userResetPlanlist(input: $input)
    }
  `;

  // 构造请求体
  const data = {
    query: mutation.loc?.source.body, // 获取 GraphQL 查询的 body
    operationName: 'userResetPlanlist', // 操作名称，选填，查询文档有多个操作时必填
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
      if (response.success && response.data.userResetPlanlist) {
        return true; // 返回布尔值，表示保存成功
      }
      throw new Error(response.errorMessage || '列表保存失败');
    })
    .catch((error) => {
      console.error('保存计划列表失败:', error);
      throw error; // 返回错误信息
    });
}
