import api from './base';

export type TraccarPosition = {
  id: number;
  deviceId: number;
  latitude: number;
  longitude: number;
  speed?: number;
  course?: number;
  attributes?: any;
};

export const fetchLatestPosition = async (deviceId: string | number): Promise<TraccarPosition | null> => {
  const res = await api.get('/positions', { params: { deviceId } });
  const data = res?.data;
  const arr = Array.isArray(data) ? data : (data?.positions || []);
  if (!arr || arr.length === 0) return null;
  const p = arr[arr.length - 1];
  return {
    id: p.id,
    deviceId: p.deviceId,
    latitude: p.latitude,
    longitude: p.longitude,
    speed: p.speed,
    course: p.course,
    attributes: p.attributes,
  };
};
