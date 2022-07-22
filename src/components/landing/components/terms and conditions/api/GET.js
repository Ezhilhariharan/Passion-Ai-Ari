import instance from "services/Instance";
export function GetTermsData() {
  return instance.get(`admin/common/terms_and_conditions/`);
}
