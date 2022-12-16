import React, {createContext, useState} from 'react';

// credentialsContext
interface IContextProps {
  email: any;
  setEmail: ({type}: any) => void;
  token: any;
  setToken: ({type}: any) => void;
  id: any;
  setId: ({type}: any) => void;
  userLoggedIn: any;
  setUserLoggedIn: ({type}: any) => void;
}

export const AuthContext = createContext({} as IContextProps);
