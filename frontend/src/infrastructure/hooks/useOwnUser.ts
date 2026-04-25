import { useSelector } from 'react-redux';
import type { RootState } from '../../application/store';

export const useOwnUser = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.profile);

  return {
    user,
    isAuthenticated,
  };
};
