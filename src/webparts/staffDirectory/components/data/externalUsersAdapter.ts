import { type IColumn } from "@fluentui/react";

export interface IJsonPlaceholderUser {
  id: number;
  name: string;
  email: string;
  company?: {
    name?: string;
  };
}

export interface IExternalUserListItem {
  key: string;
  name: string;
  email: string;
  company: string;
}

export const externalUsersColumns: IColumn[] = [
  {
    key: "col-external-name",
    name: "Name",
    fieldName: "name",
    minWidth: 160,
    maxWidth: 280,
    isResizable: true,
  },
  {
    key: "col-external-email",
    name: "Email",
    fieldName: "email",
    minWidth: 180,
    maxWidth: 320,
    isResizable: true,
  },
  {
    key: "col-external-company",
    name: "Company",
    fieldName: "company",
    minWidth: 140,
    maxWidth: 260,
    isResizable: true,
  },
];

export const toExternalUserListItems = (
  users: IJsonPlaceholderUser[],
): IExternalUserListItem[] =>
  users.map((user) => ({
    key: String(user.id),
    name: user.name,
    email: user.email,
    company: user.company?.name || "N/A",
  }));
