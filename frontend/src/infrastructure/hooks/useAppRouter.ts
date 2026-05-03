import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';

export const useAppRouter = () => {
  const navigate = useNavigate();

  return {
    navigate,
    goToHome: () => navigate(ROUTES.HOME),
    goToLogin: () => navigate(ROUTES.LOGIN),
    goToRegister: () => navigate(ROUTES.REGISTER),
    goToProfile: () => navigate(ROUTES.PROFILE),
    goToMap: () => navigate(ROUTES.MAP),
    goToHealth: () => navigate(ROUTES.HEALTH),
    goToFeedback: () => navigate(ROUTES.FEEDBACK),
    goToUsers: () => navigate(ROUTES.USERS),
    goToVet: () => navigate(ROUTES.VET),
  };
};
