
export const formatLocation = (location) => {
  if (!location) return 'Location not available';
  
  if (location.address) return location.address;
  
  if (location.coordinates && location.coordinates.length === 2) {
    return `Lat: ${location.coordinates[1].toFixed(6)}, Long: ${location.coordinates[0].toFixed(6)}`;
  }
  
  return 'Location not available';
};


export const getCoordinatesString = (location) => {
  if (!location || !location.coordinates || location.coordinates.length !== 2) {
    return 'Coordinates not available';
  }
  
  const [longitude, latitude] = location.coordinates;
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};


export const formatDate = (date, includeTime = true) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  return dateObj.toLocaleDateString('en-US', options);
};
