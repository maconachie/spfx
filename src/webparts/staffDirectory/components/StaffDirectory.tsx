import * as React from "react";
import styles from "./StaffDirectory.module.scss";
import type { IStaffDirectoryProps } from "./IStaffDirectoryProps";
import staffData from "./data/staffData";
import {
  toStaffDetailsListItems,
  staffDetailsListColumns,
} from "./data/staffDetailsListAdapter";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react";

export default class StaffDirectory extends React.Component<IStaffDirectoryProps> {
  public render(): React.ReactElement<IStaffDirectoryProps> {
    const { hasTeamsContext } = this.props;

    return (
      <section
        className={`${styles.staffDirectory} ${hasTeamsContext ? styles.teams : ""}`}
      >
        <div className={styles.welcome}>
          <h2>Staff Directory</h2>

          <DetailsList
            items={toStaffDetailsListItems(staffData).filter(
              (person) => !person.isActive,
            )}
            columns={staffDetailsListColumns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selectionMode={SelectionMode.none}
          />
        </div>
      </section>
    );
  }
}
