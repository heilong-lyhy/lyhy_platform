// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { gql } from 'graphql-tag';

/** 获取当前的用户 */
export async function currentUser(options?: { [key: string]: any }) {
  const query = gql`
    query getCurrentUser {
      getCurrentUser {
        name
        avatar
        userid
        email
        signature
        title
        group
        tags {
          key
          label
        }
        notifyCount
        unreadCount
        country
        access
        geographic {
          province {
            label
            key
          }
          city {
            label
            key
          }
        }
        address
        phone
      }
    }
  `;

  const data = {
    query: query.loc?.source.body,
    operationName: 'getCurrentUser',
  };

  return request<{
    data: {
      getCurrentUser: API.CurrentUser;
    };
  }>('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  }).then((response) => {
    console.log('currentUser API 完整响应:', response);
    console.log('response.data:', response.data);
    console.log('response.data?.getCurrentUser:', response.data?.getCurrentUser);
    return {
      data: response.data?.getCurrentUser,
    };
  });
}

/** 退出登录接口 */
export async function outLogin(options?: { [key: string]: any }) {
  const mutation = gql`
    mutation logout {
      logout
    }
  `;

  const data = {
    query: mutation.loc?.source.body,
    operationName: 'logout',
  };

  return request<Record<string, any>>('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

/** 登录接口 */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  const mutation = gql`
    mutation login($input: LoginInput!) {
      login(input: $input) {
        status
        type
        currentAuthority
        token
      }
    }
  `;

  const variables = {
    input: {
      username: body.username,
      password: body.password,
      type: body.type,
      autoLogin: body.autoLogin,
    },
  };

  const data = {
    query: mutation.loc?.source.body,
    operationName: 'login',
    variables,
  };

  return request<{
    data: {
      login: API.LoginResult;
    };
  }>('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  }).then((response) => response.data?.login || {});
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
