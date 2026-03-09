import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';

// This custom hook is a simple shortcut to access the AuthContext.
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;