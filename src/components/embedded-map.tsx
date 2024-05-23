'use client';

import { AdvancedMarker, Map } from '@vis.gl/react-google-maps';

type Props = {
  // address: string;
  lat: number;
  lng: number;
};

const EmbeddedMap = ({ lat, lng }: Props) => {
  // const map = useMap();
  // const placesLib = useMapsLibrary('places');
  // const [markerRef, marker] = useAdvancedMarkerRef();

  // useEffect(() => {
  //   if (!placesLib || !map) return;

  //   const svc = new placesLib.PlacesService(map);
  //   svc.findPlaceFromQuery(
  //     {
  //       query: address,
  //       fields: ['geometry', 'formatted_address'],
  //     },
  //     (arr) => {
  //       if (arr?.length) {
  //         const lat = arr[0].geometry?.location?.lat()!;
  //         const lng = arr[0].geometry?.location?.lng()!;

  //         map.setCenter({
  //           lat,
  //           lng,
  //         });
  //         map.setZoom(15);

  //         if (marker) {
  //           marker!.position = { lat, lng };
  //         }
  //       }
  //     }
  //   );
  // }, [placesLib, map, address, marker]);

  return (
    <>
      <Map
        // defaultBounds={{ north: 50, south: 70, east: -80, west: -100 }}
        defaultCenter={{ lat, lng }}
        defaultZoom={15}
        mapId="fe160bca0b1ef09d"
      >
        <AdvancedMarker position={{ lat, lng }} />
      </Map>
    </>
  );
};

export default EmbeddedMap;
