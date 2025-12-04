import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Config from 'react-native-config';
import api, { getAuthToken } from '../../api/base';
import type { RouteData, Coordinate } from './routesData';
import MarkerOrigin from '../../assets/markers/marker-origin-own.svg';
import MarkerDestination from '../../assets/markers/marker-destination.svg';

type Props = {
  route: RouteData | null;
  onRouteSelect?: (stops: Coordinate[]) => void;
  onModeChange?: (isDetails: boolean) => void;
  onClose?: () => void;
};

export default function DetailRoutes({ route, onRouteSelect, onModeChange, onClose }: Props) {
  const [loadingDetails, setLoadingDetails] = React.useState(false);
  const [errorDetails, setErrorDetails] = React.useState<string | null>(null);
  const [addressMap, setAddressMap] = React.useState<Record<string, string>>({});
  const [stopsLocal, setStopsLocal] = React.useState<Coordinate[]>([]);
  const onSelectRef = React.useRef<typeof onRouteSelect>(onRouteSelect);
  React.useEffect(() => { onSelectRef.current = onRouteSelect; }, [onRouteSelect]);
  const loadedRouteIdRef = React.useRef<number | null>(null);

  // El modo detalle ya lo activa el contenedor al seleccionar una ruta

  const parseMinutes = (time: string): number => {
    const m = String(time).match(/(\d+(?:\.\d+)?)\s*min/i);
    return m ? Math.round(Number(m[1])) : 0;
  };

  const getMapsApiKey = (): string => {
    return (Config as any)?.GOOGLE_MAPS_API_KEY || (Config as any)?.Maps_API_KEY || '';
  };

  const getAddressFromCoordinates = React.useCallback(async (latitude: number, longitude: number): Promise<string> => {
    const apiKey = getMapsApiKey();
    if (!apiKey) return '';
    try {
      const resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
      const data = await resp.json();
      if (data.status === 'OK' && data.results?.length > 0) {
        const comps = Array.isArray(data.results[0].address_components) ? data.results[0].address_components : [];
        const routeName = String((comps.find((c: any) => (c.types || []).includes('route'))?.long_name) || '').trim();
        const number = String((comps.find((c: any) => (c.types || []).includes('street_number'))?.long_name) || '').trim();
        const out = `${routeName}${routeName && number ? ' ' : ''}${number}`.trim();
        return out;
      }
      return '';
    } catch {
      return '';
    }
  }, []);

  const getStopName = (s: any): string => {
    const cands = [
      s?.stop_name,
      s?.stopName,
      s?.name,
      s?.title,
      s?.label,
      s?.student,
      s?.Directions,
      s?.stop?.name,
    ];
    for (const v of cands) {
      const str = String(v ?? '').trim();
      if (str) return str;
    }
    return '';
  };

  const getStopAddress = (s: any): string => {
    const cands = [s?.address, s?.stop_address, s?.stopAddress, s?.street, s?.location?.address];
    for (const v of cands) {
      const str = String(v ?? '').trim();
      if (str) return str;
    }
    return '';
  };

  const loadRouteDetails = React.useCallback(async (r: RouteData) => {
    if (!r?.id || typeof r.id !== 'number' || Number.isNaN(r.id)) {
      const baseStops = r?.stops || [];
      setStopsLocal(baseStops);
      onSelectRef.current?.(baseStops);
      setLoadingDetails(false);
      return;
    }
    setLoadingDetails(true);
    setErrorDetails(null);
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const res = await api.get(`/travels/v1/routes/${r.id}`, { headers });
      const payload = res.data;
      const body = Array.isArray(payload) ? (payload[0] || {}) : (payload || {});
      const list = Array.isArray((body as any)?.stops)
        ? (body as any).stops
        : ((body as any)?.data?.stops || (body as any)?.route?.stops || []);
      const stops: Coordinate[] = (Array.isArray(list) ? list : []).map((s: any) => ({
        latitude: Number(s?.latitude),
        longitude: Number(s?.longitude),
        address: getStopAddress(s),
        name: getStopName(s) || getStopAddress(s),
        status: s?.status as ('red' | 'green' | undefined),
      }));
      setStopsLocal(stops);
      onSelectRef.current?.(stops);
    } catch {
      setErrorDetails('No se pudo cargar el detalle de la ruta');
      const baseStops = r?.stops || [];
      setStopsLocal(baseStops);
      onSelectRef.current?.(baseStops);
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  React.useEffect(() => {
    if (!route) return;
    const id = typeof route.id === 'number' && !Number.isNaN(route.id) ? route.id : null;
    const baseStops = route.stops || [];
    setStopsLocal(baseStops);
    onSelectRef.current?.(baseStops);
    if (id != null && loadedRouteIdRef.current !== id) {
      loadedRouteIdRef.current = id;
      loadRouteDetails(route);
    } else if (id == null) {
      setLoadingDetails(false);
    }
  }, [route, loadRouteDetails]);

  const orderedStops = React.useMemo(() => {
    return stopsLocal || [];
  }, [stopsLocal]);

  React.useEffect(() => {
    const run = async () => {
      if (!route || orderedStops.length === 0) return;
      const pairs = await Promise.all(
        orderedStops.map(async (c, idx) => {
          if (c.address) return [`${route.id}-${idx}`, String(c.address).split(',')[0].trim()];
          const addr = await getAddressFromCoordinates(c.latitude, c.longitude);
          return [`${route.id}-${idx}`, addr];
        })
      );
      const next: Record<string, string> = {};
      for (const [k, v] of pairs) {
        if (v) next[k as string] = v as string;
      }
      setAddressMap(prev => ({ ...prev, ...next }));
    };
    run();
  }, [route, orderedStops, getAddressFromCoordinates]);

  const totalMin = parseMinutes(route?.time || '0 min');

  const perLeg = React.useMemo(() => {
    if (!orderedStops || orderedStops.length < 2 || totalMin <= 0) return [] as number[];
    const legs = orderedStops.length - 1;
    const deg2rad = (deg: number) => deg * (Math.PI / 180);
    const haversineKm = (a: Coordinate, b: Coordinate): number => {
      const R = 6371;
      const dLat = deg2rad(b.latitude - a.latitude);
      const dLon = deg2rad(b.longitude - a.longitude);
      const s1 = Math.sin(dLat / 2);
      const s2 = Math.sin(dLon / 2);
      const c = 2 * Math.asin(Math.sqrt(s1 * s1 + Math.cos(deg2rad(a.latitude)) * Math.cos(deg2rad(b.latitude)) * s2 * s2));
      return R * c;
    };
    const distances = Array.from({ length: legs }, (_, i) => haversineKm(orderedStops[i], orderedStops[i + 1]));
    const totalKm = distances.reduce((sum, d) => sum + d, 0);
    if (totalKm <= 0) return Array(legs).fill(Math.round(totalMin / legs));
    return distances.map(d => Math.max(1, Math.round((d / totalKm) * totalMin)));
  }, [orderedStops, totalMin]);

  let remaining = totalMin;

  return (
    <View style={styles.container}>
      <View style={[styles.contentFrame, { flex: 1 }]}>
        

        {loadingDetails && orderedStops.length === 0 ? (
          <View style={styles.detailsScroll}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#5d01bc" />
              <Text style={styles.loadingText}>Cargando detalles…</Text>
            </View>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={true} style={styles.detailsScroll}>
            {loadingDetails ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color="#5d01bc" />
                <Text style={styles.loadingText}>Actualizando detalles…</Text>
              </View>
            ) : null}
            <View style={styles.stopList}>
            {orderedStops.map((c, routeIdx) => {
              const isFirst = routeIdx === 0;
              const isLast = routeIdx === orderedStops.length - 1;
              const stopTitle = (c.name || `Punto ${routeIdx + 1}`).trim();
              const legMin = routeIdx < perLeg.length ? perLeg[routeIdx] : 0;
              remaining = !isLast ? Math.max(0, remaining - legMin) : remaining;
              return (
                <View key={`${route?.id}-${routeIdx}`} style={styles.stopRow}>
                  <View style={styles.stopLeft}>
                    <View style={styles.stopIconCol}>
                      {!isFirst && <View style={styles.connectorTop} />}
                      {isFirst ? (
                        <MarkerOrigin width={22} height={22} fill="#2563EB" stroke="#fff" strokeWidth={2.5} />
                      ) : isLast ? (
                        <MarkerDestination width={23} height={23} fill="#2563EB" color="#2563EB" />
                      ) : c.status === 'green' ? (
                        <MarkerOrigin width={22} height={22} fill="#10B981" stroke="#fff" strokeWidth={2.5} />
                      ) : (
                        <MarkerOrigin width={22} height={22} fill="#EF4444" stroke="#fff" strokeWidth={2.5} />
                      )}
                      {!isLast && <View style={styles.connectorBottom} />}
                    </View>
                    <View style={styles.stopTextCol}>
                      {(() => {
                        const addr = (addressMap[`${route?.id}-${routeIdx}`] || c.address || '').trim();
                        return addr && addr !== stopTitle ? (<Text style={styles.stopCoord}>{addr}</Text>) : null;
                      })()}
                      <Text style={styles.stopTitle}>{stopTitle}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
            </View>
            <View style={styles.detailsHeader}>
              {errorDetails ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{errorDetails}</Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.finalizeButton}
                onPress={() => {
                  onRouteSelect?.([]);
                  onModeChange?.(false);
                  onClose?.();
                }}
              >
                <Text style={styles.finalizeButtonText}>Finalizar ruta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', flex: 1, marginBottom:4 },
  contentFrame: { alignSelf: 'center', width: '100%', marginBottom:4 },
  headerRow: { paddingVertical: 12, backgroundColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom:4 },
  title: { fontSize: 17, fontWeight: '600', color: '#1F1F1F', marginBottom:4 },
  detailsScroll: { flex: 1  },
  detailsHeader: { backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4 },
  loadingBox: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 13, color: '#444', marginTop: 8 },
  stopRow: { flexDirection: 'row', borderBottomColor: '#F0F0F0', marginBottom:4 },
  stopLeft: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  stopIconCol: { width: 24, alignItems: 'center' },
  connectorTop: { position: 'absolute', top: -12, height: 12, width: 1, backgroundColor: '#DCDBDF' },
  connectorBottom: { position: 'absolute', bottom: -12, height: 12, width: 1, backgroundColor: '#DCDBDF' },
  stopTextCol: { marginLeft: 12, flex: 1 },
  stopTitle: { fontSize: 14, fontWeight: '600', color: '#222', marginBottom: 4, paddingBottom: 5 },
  stopCoord: { fontSize: 11, color: '#888' },
  finalizeButton: { backgroundColor: '#5d01bc', marginTop: 0, paddingVertical: 7, borderRadius: 8, alignItems: 'center' },
  finalizeButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  errorBox: { backgroundColor: '#FEF2F2', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 8 },
  errorText: { color: '#B91C1C', fontSize: 13 },
  stopList: { paddingTop: 4 },
})
