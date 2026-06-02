// src/webparts/staffDirectory/components/data/staffDetailsListAdapter.ts
import { type IColumn } from "@fluentui/react";
import { type IStaff } from "./staffData";

export interface IStaffDetailsListItem {
  key: string;
  name: string;
  department: string;
  status: string;
  isActive: boolean;
}

export const toStaffDetailsListItems = (
  staff: IStaff[],
): IStaffDetailsListItem[] =>
  staff.map((person) => ({
    key: String(person.id),
    name: person.name,
    department: person.department,
    status: person.isActive ? "Active" : "Inactive",
    isActive: person.isActive,
  }));

export const staffDetailsListColumns: IColumn[] = [
  {
    key: "col-name",
    name: "Name",
    fieldName: "name",
    minWidth: 160,
    maxWidth: 280,
    isResizable: true,
  },
  {
    key: "col-department",
    name: "Department",
    fieldName: "department",
    minWidth: 120,
    maxWidth: 220,
    isResizable: true,
  },
  // {
  //   key: "col-status",
  //   name: "Status",
  //   fieldName: "status",
  //   minWidth: 90,
  //   maxWidth: 120,
  //   isResizable: true,
  // },
];
