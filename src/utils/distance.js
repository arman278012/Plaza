function validLocation(location) {
  return Boolean(
    location &&
    Number.isFinite(location.lat) && location.lat >= -90 && location.lat <= 90 &&
    Number.isFinite(location.lng) && location.lng >= -180 && location.lng <= 180
  );
}

function distanceKm(a, b) {
  const radians = (value) => value * Math.PI / 180;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const lat1 = radians(a.lat);
  const lat2 = radians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

module.exports = { validLocation, distanceKm };
