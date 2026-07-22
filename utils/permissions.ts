// Permissions utilities
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export const permissionsUtils = {
  /**
   * Request camera permission
   */
  async requestCameraPermission(): Promise<boolean> {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    return status === 'granted';
  },

  /**
   * Request media library permission
   */
  async requestMediaLibraryPermission(): Promise<boolean> {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    return status === 'granted';
  },

  /**
   * Request location permission
   */
  async requestLocationPermission(): Promise<boolean> {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    return status === 'granted';
  },

  /**
   * Request health permission
   */
  async requestHealthPermission(): Promise<boolean> {
    const { status } = await Permissions.askAsync(Permissions.HEALTH);
    return status === 'granted';
  },

  /**
   * Request push notification permission
   */
  async requestNotificationPermission(): Promise<boolean> {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    return status === 'granted';
  },

  /**
   * Request calendar permission
   */
  async requestCalendarPermission(): Promise<boolean> {
    const { status } = await Permissions.askAsync(Permissions.CALENDAR);
    return status === 'granted';
  },

  /**
   * Check permission status
   */
  async getPermissionStatus(permission: Permissions.PermissionType): Promise<string> {
    const { status } = await Permissions.getAsync(permission);
    return status;
  },
};
