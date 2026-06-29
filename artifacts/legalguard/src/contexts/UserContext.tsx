import React, { createContext, useContext, useState, useEffect } from "react";

type UserType = "individual" | "organization" | null;

interface UserContextValue {
  userType: UserType;
  setUserType: (type: UserType) => void;
  userName: string;
  setUserName: (name: string) => void;
  orgName: string;
  setOrgName: (name: string) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextValue>({
  userType: null,
  setUserType: () => {},
  userName: "Jane Doe",
  setUserName: () => {},
  orgName: "Acme Corp Legal",
  setOrgName: () => {},
  clearUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userType, setUserTypeState] = useState<UserType>(() => {
    return (localStorage.getItem("lg_user_type") as UserType) || null;
  });
  const [userName, setUserNameState] = useState(() => {
    return localStorage.getItem("lg_user_name") || "Jane Doe";
  });
  const [orgName, setOrgNameState] = useState(() => {
    return localStorage.getItem("lg_org_name") || "Acme Corp Legal";
  });

  const setUserType = (type: UserType) => {
    setUserTypeState(type);
    if (type) localStorage.setItem("lg_user_type", type);
    else localStorage.removeItem("lg_user_type");
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem("lg_user_name", name);
  };

  const setOrgName = (name: string) => {
    setOrgNameState(name);
    localStorage.setItem("lg_org_name", name);
  };

  const clearUser = () => {
    setUserTypeState(null);
    setUserNameState("Jane Doe");
    setOrgNameState("Acme Corp Legal");
    localStorage.removeItem("lg_user_type");
    localStorage.removeItem("lg_user_name");
    localStorage.removeItem("lg_org_name");
  };

  return (
    <UserContext.Provider value={{ userType, setUserType, userName, setUserName, orgName, setOrgName, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
