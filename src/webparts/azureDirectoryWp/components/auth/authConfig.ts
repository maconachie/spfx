import type { Configuration, PopupRequest } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "27d92c42-4dc8-4e25-9ea6-ea0953320c2b",
    authority:
      "https://login.microsoftonline.com/80dcf561-55e9-4726-b9d8-1cd406bb650e",
    // SPFx can run from localhost and hosted pages, so use the current origin.
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const loginRequest: PopupRequest = {
  scopes: ["User.Read"],
};
