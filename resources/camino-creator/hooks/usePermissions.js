// window.Permissions should contain the permissions
// for the current user set in the Laravel blade template
// See also:
// https://mmccaff.github.io/2018/11/03/laravel-permissions-in-vue-components/

function userCan(permissionName) {
  if (!window.Permissions) {
    throw Error("no Permissions object found on window");
  }
  return window.Permissions.includes(permissionName);
}

export default () => ({ userCan });
