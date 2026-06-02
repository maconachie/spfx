import * as React from "react";
import type { AccountInfo } from "@azure/msal-browser";

export interface IMsalAuthContextValue {
  authenticated: boolean;
  account: AccountInfo | null;
  accessToken?: string;
  getAccessToken: () => Promise<string | undefined>;
}

const defaultContextValue: IMsalAuthContextValue = {
  authenticated: false,
  account: null,
  accessToken: undefined,
  getAccessToken: async () => undefined,
};

export const MsalAuthContext =
  React.createContext<IMsalAuthContextValue>(defaultContextValue);

export const useMsalAuth = (): IMsalAuthContextValue =>
  React.useContext(MsalAuthContext);
