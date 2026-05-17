import { Configuration } from '../client/runtime';
import { AuthControllerApi, PetControllerApi, UserControllerApi, DeviceControllerApi, TelemetryControllerApi, SafeZoneControllerApi, VetControllerApi, SpeciesControllerApi, FeedbackControllerApi } from '../client/apis';

const getToken = () => localStorage.getItem('token') ?? '';

const config = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
  accessToken: getToken,
});

export const authApi = new AuthControllerApi(config);
export const petApi = new PetControllerApi(config);
export const userApi = new UserControllerApi(config);
export const deviceApi = new DeviceControllerApi(config);
export const telemetryApi = new TelemetryControllerApi(config);
export const safeZoneApi = new SafeZoneControllerApi(config);
export const vetApi = new VetControllerApi(config);
export const speciesApi = new SpeciesControllerApi(config);
export const feedbackApi = new FeedbackControllerApi(config);