import instance from "services/Instance";
export function getDataPolicy() {
  return instance.get(`admin/common/privacy_policy/`);
}
