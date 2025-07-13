
/**
 * Formats a location object or string into a human-readable format.
 * Handles multiple formats including GeoJSON, coordinate strings, and objects with lat/lng properties.
 * 
 * @param {Object|String} location - The location to format
 * @returns {String} Formatted location string
 */
export const formatLocation = (location) => {
  if (!location) return 'Location not available';
  
  // Try to parse if it's a JSON string
  if (typeof location === 'string') {
    try {
      // Check if it's a JSON string first
      const parsedLocation = JSON.parse(location);
      
      // Recursively call with the parsed object
      return formatLocation(parsedLocation);
    } catch (e) {
      // Not a JSON string, continue processing as a regular string
      
      // Check if it's likely to be a coordinate string
      const coordMatch = location.match(/([-+]?\d+\.\d+)[,\s]+([-+]?\d+\.\d+)/);
      if (coordMatch) {
        // It's a coordinate string like "12.345, 67.890"
        return `Lat: ${parseFloat(coordMatch[1]).toFixed(6)}, Long: ${parseFloat(coordMatch[2]).toFixed(6)}`;
      }
      // Return the string as an address
      return location;
    }
  }
  
  // Handle nested location objects (MongoDB GeoJSON responses)
  if (location.location && typeof location.location === 'object') {
    return formatLocation(location.location);
  }
  
  // If it's an object with address property
  if (location.address) {
    return location.address;
  }
  
  // If it's an object with coordinates array (GeoJSON format)
  if (location.coordinates && Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
    try {
      // Check if coordinates are valid numbers before using toFixed
      const lat = typeof location.coordinates[1] === 'number' ? location.coordinates[1].toFixed(6) : String(location.coordinates[1]);
      const lng = typeof location.coordinates[0] === 'number' ? location.coordinates[0].toFixed(6) : String(location.coordinates[0]);
      return `Lat: ${lat}, Long: ${lng}`;
    } catch (e) {
      console.error('Error formatting GeoJSON coordinates:', e);
    }
  }
  
  // If it has lat/lng properties directly
  if ((location.lat !== undefined && location.lng !== undefined) || 
      (location.latitude !== undefined && location.longitude !== undefined)) {
    try {
      const lat = location.lat || location.latitude;
      const lng = location.lng || location.longitude;
      const latStr = typeof lat === 'number' ? lat.toFixed(6) : String(lat);
      const lngStr = typeof lng === 'number' ? lng.toFixed(6) : String(lng);
      return `Lat: ${latStr}, Long: ${lngStr}`;
    } catch (e) {
      console.error('Error formatting lat/lng coordinates:', e);
    }
  }
  
  // Try to convert to string if possible
  if (location.toString && typeof location.toString === 'function' && 
      location.toString() !== '[object Object]') {
    return location.toString();
  }
  
  return 'Location not available';
};


export const getCoordinatesString = (location) => {
  if (!location) return 'Coordinates not available';
  
  // Try to parse if it's a JSON string
  if (typeof location === 'string') {
    try {
      // Check if it's a JSON string first
      const parsedLocation = JSON.parse(location);
      
      // Recursively call with the parsed object
      return getCoordinatesString(parsedLocation);
    } catch (e) {
      // Not a JSON string, try to extract coordinates if it contains them
      const coordMatch = location.match(/([-+]?\d+\.\d+)[,\s]+([-+]?\d+\.\d+)/);
      if (coordMatch) {
        return `${parseFloat(coordMatch[1]).toFixed(6)}, ${parseFloat(coordMatch[2]).toFixed(6)}`;
      }
      return 'Coordinates not available';
    }
  }
  
  // If it's an object with coordinates array (GeoJSON format)
  if (location.coordinates && location.coordinates.length === 2) {
    const [longitude, latitude] = location.coordinates;
    // Check if coordinates are valid numbers before using toFixed
    const lat = typeof latitude === 'number' ? latitude.toFixed(6) : String(latitude);
    const lng = typeof longitude === 'number' ? longitude.toFixed(6) : String(longitude);
    return `${lat}, ${lng}`;
  }
  
  // If it has lat/lng properties directly
  if ((location.lat !== undefined && location.lng !== undefined) || 
      (location.latitude !== undefined && location.longitude !== undefined)) {
    const lat = location.lat || location.latitude;
    const lng = location.lng || location.longitude;
    const latStr = typeof lat === 'number' ? lat.toFixed(6) : String(lat);
    const lngStr = typeof lng === 'number' ? lng.toFixed(6) : String(lng);
    return `${latStr}, ${lngStr}`;
  }
  
  return 'Coordinates not available';
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