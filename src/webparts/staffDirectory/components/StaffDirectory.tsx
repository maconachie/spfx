import * as React from "react";
import styles from "./StaffDirectory.module.scss";
import type { IStaffDirectoryProps } from "./IStaffDirectoryProps";
import staffData from "./data/staffData";
import {
  toStaffDetailsListItems,
  staffDetailsListColumns,
} from "./data/staffDetailsListAdapter";
import {
  externalUsersColumns,
  toExternalUserListItems,
  type IExternalUserListItem,
  type IJsonPlaceholderUser,
} from "./data/externalUsersAdapter";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react";

interface IStaffDirectoryState {
  externalUsers: IExternalUserListItem[];
  isLoadingExternalUsers: boolean;
  externalUsersError: string;
}

export default class StaffDirectory extends React.Component<IStaffDirectoryProps> {
  public state: IStaffDirectoryState = {
    externalUsers: [],
    isLoadingExternalUsers: true,
    externalUsersError: "",
  };

  public componentDidMount(): void {
    this._loadExternalUsers().catch(() => {
      // Errors are handled inside _loadExternalUsers.
      return undefined;
    });
  }

  private async _loadExternalUsers(): Promise<void> {
    try {
      const response: Response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const users: IJsonPlaceholderUser[] =
        (await response.json()) as IJsonPlaceholderUser[];

      this.setState({
        externalUsers: toExternalUserListItems(users),
        isLoadingExternalUsers: false,
        externalUsersError: "",
      });
    } catch (error) {
      this.setState({
        externalUsers: [],
        isLoadingExternalUsers: false,
        externalUsersError: (error as Error).message,
      });
    }
  }

  public render(): React.ReactElement<IStaffDirectoryProps> {
    const { hasTeamsContext } = this.props;
    const { externalUsers, isLoadingExternalUsers, externalUsersError } =
      this.state;

    return (
      <section
        className={`${styles.staffDirectory} ${hasTeamsContext ? styles.teams : ""}`}
      >
        <div className={styles.welcome}>
          <h2>Staff Directory</h2>

          <h3>Local Staff Data</h3>

          <DetailsList
            items={toStaffDetailsListItems(staffData).filter(
              (person) => !person.isActive,
            )}
            columns={staffDetailsListColumns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selectionMode={SelectionMode.none}
          />

          <h3>Public API Staff Data</h3>
          {isLoadingExternalUsers && <p>Loading external users...</p>}
          {!isLoadingExternalUsers && externalUsersError && (
            <p>Could not load external users: {externalUsersError}</p>
          )}
          {!isLoadingExternalUsers && !externalUsersError && (
            <DetailsList
              items={externalUsers}
              columns={externalUsersColumns}
              setKey="external-users"
              layoutMode={DetailsListLayoutMode.fixedColumns}
              selectionMode={SelectionMode.none}
            />
          )}
        </div>
      </section>
    );
  }
}
