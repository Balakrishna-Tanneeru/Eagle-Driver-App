export default function createRideRequestDTO({
  pickupLat,
  pickupLng,
  dropLat,
  dropLng,
  pickupAddress,
  dropAddress,
  distance,
  fare,
}) {
  const parseNum = (val) => {
    const n = typeof val === 'number' ? val : parseFloat(val);
    return isNaN(n) ? null : n;
  };

  const safePickupLat = parseNum(pickupLat);
  const safePickupLng = parseNum(pickupLng);
  const safeDropLat = parseNum(dropLat);
  const safeDropLng = parseNum(dropLng);
  const safeDistance = parseNum(distance);
  const safeFare = parseNum(fare);

  const finalPayload = {
    pickupLat: safePickupLat,
    pickupLng: safePickupLng,
    dropLat: safeDropLat,
    dropLng: safeDropLng,
    pickupAddress: pickupAddress?.trim() || 'Invalid coordinates',
    dropAddress: dropAddress?.trim() || 'Invalid coordinates',
    status: 'REQUESTED',
    timestamp: new Date().toISOString(),
    distance: safeDistance,
    fare: safeFare,
  };

  console.log('[createRideRequestDTO] Final Payload:', finalPayload);

  return finalPayload;
}
