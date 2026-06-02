import * as React from "react";
import styles from "./AzureDirectoryWp.module.scss";
import { MsalAuthWrapper } from "./auth/MsalAuthWrapper";

import type { IAzureDirectoryWpProps } from "./IAzureDirectoryWpProps";
import { escape } from "@microsoft/sp-lodash-subset";
import welcomeDark from "../assets/welcome-dark.png";
import welcomeLight from "../assets/welcome-light.png";

export default class AzureDirectoryWp extends React.Component<IAzureDirectoryWpProps> {
  public render(): React.ReactElement<IAzureDirectoryWpProps> {
    const { description, isDarkTheme, hasTeamsContext } = this.props;

    const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
      // This function can be used to trigger login if needed.
      console.log(event);
    };

    return (
      <MsalAuthWrapper>
        <section
          className={`${styles.azureDirectoryWp} ${hasTeamsContext ? styles.teams : ""}`}
        >
          <div className={styles.welcome}>
            <div>
              <button onClick={handleLogin}>Login with Microsoft</button>
            </div>
          </div>
        </section>
      </MsalAuthWrapper>
    );
  }
}
