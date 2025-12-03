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
  const p = arr.slice().sort((a: any, b: any) => {
    const ai = Number(a?.id || 0);
    const bi = Number(b?.id || 0);
    return ai - bi;
  })[arr.length - 1];
  return {
    id: Number(p.id),
    deviceId: Number(p.deviceId ?? deviceId),
    latitude: Number(p.latitude),
    longitude: Number(p.longitude),
    speed: p.speed,
    course: p.course,
    attributes: p.attributes,
  };
};
