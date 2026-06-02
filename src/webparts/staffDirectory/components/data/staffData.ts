import staff from "./staff.json";

export interface IStaff {
  id: number;
  name: string;
  department: string;
  isActive: boolean;
}

const staffData: IStaff[] = staff.data;
export default staffData;
