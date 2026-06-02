import * as React from "react";
import {
  InteractionRequiredAuthError,
  type AccountInfo,
  type AuthenticationResult,
  PublicClientApplication,
} from "@azure/msal-browser";

import styles from "../AzureDirectoryWp.module.scss";
import { loginRequest, msalConfig } from "./authConfig";
import { MsalAuthContext, type IMsalAuthContextValue } from "./MsalAuthContext";

interface IMsalAuthWrapperProps {
  children: React.ReactNode;
}

let msalInstance: PublicClientApplication | undefined;

const getMsalInstance = (): PublicClientApplication => {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);
  }

  return msalInstance;
};

export const MsalAuthWrapper: React.FC<IMsalAuthWrapperProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [account, setAccount] = React.useState<AccountInfo | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | undefined>();
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const client = React.useMemo(() => getMsalInstance(), []);

  const resolveActiveAccount = React.useCallback((): AccountInfo | null => {
    const current = client.getActiveAccount();
    if (current) {
      return current;
    }

    const [firstAccount] = client.getAllAccounts();
    if (firstAccount) {
      client.setActiveAccount(firstAccount);
      return firstAccount;
    }

    return null;
  }, [client]);

  React.useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        await client.initialize();
        const resolvedAccount = resolveActiveAccount();
        setAccount(resolvedAccount);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "MSAL initialization failed.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void init();
  }, [client, resolveActiveAccount]);

  const signIn = React.useCallback(async (): Promise<void> => {
    setErrorMessage("");

    try {
      const loginResult = await client.loginPopup(loginRequest);
      if (loginResult.account) {
        client.setActiveAccount(loginResult.account);
        setAccount(loginResult.account);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed.");
    }
  }, [client]);

  const getToken = React.useCallback(async (): Promise<string | undefined> => {
    const activeAccount = resolveActiveAccount();
    if (!activeAccount) {
      return undefined;
    }

    try {
      const tokenResult: AuthenticationResult = await client.acquireTokenSilent(
        {
          ...loginRequest,
          account: activeAccount,
        },
      );

      return tokenResult.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        const tokenResult = await client.acquireTokenPopup(loginRequest);
        return tokenResult.accessToken;
      }

      throw error;
    }
  }, [client, resolveActiveAccount]);

  const getAccessToken = React.useCallback(async (): Promise<
    string | undefined
  > => {
    const token = await getToken();
    if (token) {
      setAccessToken(token);
    }

    return token;
  }, [getToken]);

  const contextValue = React.useMemo<IMsalAuthContextValue>(
    () => ({
      authenticated: !!account,
      account,
      accessToken,
      getAccessToken,
    }),
    [account, accessToken, getAccessToken],
  );

  const signOut = React.useCallback(async (): Promise<void> => {
    setErrorMessage("");

    try {
      await client.logoutPopup({
        account: resolveActiveAccount() ?? undefined,
      });
      setAccount(null);
      setAccessToken(undefined);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Logout failed.",
      );
    }
  }, [client, resolveActiveAccount]);

  const onSignIn = React.useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await signIn();
      await getAccessToken();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Authentication error.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken, signIn]);

  const onSignOut = React.useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await signOut();
    } finally {
      setIsLoading(false);
    }
  }, [signOut]);

  React.useEffect(() => {
    const hydrateToken = async (): Promise<void> => {
      if (!account || accessToken) {
        return;
      }

      try {
        await getAccessToken();
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Token acquisition failed.",
        );
      }
    };

    void hydrateToken();
  }, [account, accessToken, getAccessToken]);

  if (isLoading) {
    return (
      <MsalAuthContext.Provider value={contextValue}>
        <div className={styles.authStatus}>Checking sign-in status...</div>
      </MsalAuthContext.Provider>
    );
  }

  if (!account) {
    return (
      <MsalAuthContext.Provider value={contextValue}>
        <div className={styles.authCard}>
          <h3 className={styles.authTitle}>Sign in to Microsoft Entra ID</h3>
          <p className={styles.authText}>
            Authenticate to access this web part.
          </p>
          {errorMessage && <p className={styles.authError}>{errorMessage}</p>}
          <button
            type="button"
            className={styles.authButton}
            onClick={() => void onSignIn()}
          >
            Sign in
          </button>
        </div>
      </MsalAuthContext.Provider>
    );
  }

  return (
    <MsalAuthContext.Provider value={contextValue}>
      <>
        <div className={styles.authStatus}>
          Signed in as <strong>{account.name ?? account.username}</strong>
          <button
            type="button"
            className={styles.authLinkButton}
            onClick={() => void onSignOut()}
          >
            Sign out
          </button>
        </div>
        {errorMessage && <p className={styles.authError}>{errorMessage}</p>}
        {children}
      </>
    </MsalAuthContext.Provider>
  );
};
