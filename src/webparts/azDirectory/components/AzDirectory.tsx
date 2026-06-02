import * as React from "react";
import styles from "./AzDirectory.module.scss";
import type { IAzDirectoryProps } from "./IAzDirectoryProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { AadHttpClient } from "@microsoft/sp-http";
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode,
} from "@fluentui/react";

interface IDataverseRow {
  key: string;
  name: string;
  accountNumber: string;
  phone: string;
}

interface IAzDirectoryState {
  rows: IDataverseRow[];
  isLoading: boolean;
  errorMessage: string;
}

const dataverseColumns: IColumn[] = [
  {
    key: "col-name",
    name: "Name",
    fieldName: "name",
    minWidth: 180,
    maxWidth: 320,
    isResizable: true,
  },
  {
    key: "col-account-number",
    name: "Account Number",
    fieldName: "accountNumber",
    minWidth: 140,
    maxWidth: 220,
    isResizable: true,
  },
  {
    key: "col-phone",
    name: "Phone",
    fieldName: "phone",
    minWidth: 140,
    maxWidth: 220,
    isResizable: true,
  },
];

export default class AzDirectory extends React.Component<IAzDirectoryProps> {
  public state: IAzDirectoryState = {
    rows: [],
    isLoading: true,
    errorMessage: "",
  };

  public componentDidMount(): void {
    this._loadDataverseRows().catch(() => {
      return undefined;
    });
  }

  public componentDidUpdate(prevProps: IAzDirectoryProps): void {
    if (
      prevProps.dataverseResource !== this.props.dataverseResource ||
      prevProps.dataversePath !== this.props.dataversePath
    ) {
      this._loadDataverseRows().catch(() => {
        return undefined;
      });
    }
  }

  private _normalizeResource(resourceUrl: string): string {
    return resourceUrl.trim().replace(/\/+$/, "");
  }

  private _normalizePath(apiPath: string): string {
    const trimmedPath: string = apiPath.trim();
    if (!trimmedPath) {
      return "/api/data/v9.2/accounts?$select=name,accountnumber,telephone1&$top=10";
    }

    return trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
  }

  private async _loadDataverseRows(): Promise<void> {
    const resource: string = this._normalizeResource(
      this.props.dataverseResource,
    );
    const path: string = this._normalizePath(this.props.dataversePath);

    if (!resource) {
      this.setState({
        rows: [],
        isLoading: false,
        errorMessage: "Set Dataverse resource URL in the web part properties.",
      });
      return;
    }

    this.setState({ isLoading: true, errorMessage: "" });

    try {
      const client: AadHttpClient =
        await this.props.aadHttpClientFactory.getClient(resource);
      const requestUrl: string = `${resource}${path}`;
      const response = await client.get(
        requestUrl,
        AadHttpClient.configurations.v1,
      );

      if (!response.ok) {
        throw new Error(
          `Dataverse request failed (${response.status} ${response.statusText})`,
        );
      }

      const payload = (await response.json()) as {
        value?: Array<{
          accountid?: string;
          name?: string;
          accountnumber?: string;
          telephone1?: string;
        }>;
      };

      const rows: IDataverseRow[] = (payload.value || []).map(
        (item, index) => ({
          key: item.accountid || String(index),
          name: item.name || "",
          accountNumber: item.accountnumber || "",
          phone: item.telephone1 || "",
        }),
      );

      this.setState({ rows, isLoading: false, errorMessage: "" });
    } catch (error) {
      this.setState({
        rows: [],
        isLoading: false,
        errorMessage: (error as Error).message,
      });
    }
  }

  public render(): React.ReactElement<IAzDirectoryProps> {
    const {
      description,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      dataverseResource,
      dataversePath,
    } = this.props;
    const { rows, isLoading, errorMessage } = this.state;

    return (
      <section
        className={`${styles.azDirectory} ${hasTeamsContext ? styles.teams : ""}`}
      >
        <div className={styles.welcome}>
          <h2>Dataverse Directory</h2>
          <div>Welcome, {escape(userDisplayName)}.</div>
          <div>{environmentMessage}</div>
          <div>
            Web part property value: <strong>{escape(description)}</strong>
          </div>
        </div>
        <div className={styles.authCard}>
          <h3>Dataverse Query (AadHttpClient)</h3>
          <p>
            Resource: <strong>{dataverseResource}</strong>
          </p>
          <p>
            Path: <strong>{dataversePath}</strong>
          </p>
          <button
            className={styles.authButton}
            onClick={() => {
              this._loadDataverseRows().catch(() => {
                return undefined;
              });
            }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Refresh Dataverse Data"}
          </button>

          {errorMessage && <p className={styles.authError}>{errorMessage}</p>}

          {!errorMessage && (
            <DetailsList
              items={rows}
              columns={dataverseColumns}
              setKey="dataverse-accounts"
              layoutMode={DetailsListLayoutMode.fixedColumns}
              selectionMode={SelectionMode.none}
            />
          )}
        </div>
      </section>
    );
  }
}
