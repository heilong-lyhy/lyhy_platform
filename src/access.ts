/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log('Access.ts: 权限检查开始');
  console.log('Access.ts: initialState:', initialState);
  console.log('Access.ts: currentUser:', currentUser);
  console.log('Access.ts: currentUser?.access:', currentUser?.access);
  console.log(
    'Access.ts: currentUser && currentUser.access === "admin":',
    currentUser && currentUser.access === 'admin',
  );

  const result = {
    canAdmin: currentUser && currentUser.access === 'admin',
  };

  console.log('Access.ts: 权限检查结果:', result);
  return result;
}
