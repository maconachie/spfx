import { AadHttpClientFactory } from "@microsoft/sp-http";

export interface IAzDirectoryProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  aadHttpClientFactory: AadHttpClientFactory;
  dataverseResource: string;
  dataversePath: string;
}
