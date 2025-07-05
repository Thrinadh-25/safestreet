/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Chip, Stack,  useTheme } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import WarningIcon from '@mui/icons-material/Warning';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapView() {
  const theme = useTheme();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [mapStyle, setMapStyle] = useState('streets');
  const [selectedReport, setSelectedReport] = useState(null);
  
  const damageReports = [
    { id: 1, latitude: 17.3850, longitude: 78.4866, severity: 'High', description: 'Structural damage to building', timestamp: '2023-06-15T14:30:00Z' },
  ];

  const mapStyles = [
    { value: 'streets', label: 'Streets', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
    { value: 'satellite', label: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' },
    { value: 'topo', label: 'Topographic', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png' },
    { value: 'dark', label: 'Dark', url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png' }
  ];

  // Initialize map
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      // Create map instance
      mapInstanceRef.current = L.map(mapRef.current).setView([17.3850, 78.4866], 12);
      
      // Create markers layer
      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
      
      // Set initial tile layer
      const initialStyle = mapStyles.find(style => style.value === mapStyle);
      L.tileLayer(initialStyle.url, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Handle map style changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      // Remove existing tile layers
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });
      
      // Add new tile layer
      const selectedStyle = mapStyles.find(style => style.value === mapStyle);
      L.tileLayer(selectedStyle.url, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyle]);
  
  // Update markers when damage reports change
  useEffect(() => {
    if (mapInstanceRef.current && markersLayerRef.current) {
      // Clear existing markers
      markersLayerRef.current.clearLayers();
      
      // Add markers for each damage report
      damageReports.forEach(report => {
        const markerColor = getSeverityColor(report.severity);
        
        // Create custom icon
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="color: ${markerColor}; font-size: 32px; display: flex; justify-content: center; align-items: center;">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                   </svg>
                 </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });
        
        // Create marker and popup
        const marker = L.marker([report.latitude, report.longitude], { icon }).addTo(markersLayerRef.current);
        
        // Popup content
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
          <div style="min-width: 200px; padding: 10px;">
            <h4 style="margin: 0 0 10px 0;">Damage Report #${report.id}</h4>
            <hr style="margin: 5px 0;" />
            <p style="margin: 5px 0; color: #666;">Severity</p>
            <span style="display: inline-block; padding: 2px 8px; margin: 3px 0; background-color: ${markerColor}; color: white; border-radius: 12px; font-size: 12px;">${report.severity}</span>
            <p style="margin: 10px 0 5px 0; color: #666;">Description</p>
            <p style="margin: 0;">${report.description}</p>
            <p style="margin: 10px 0 5px 0; color: #666;">Reported</p>
            <p style="margin: 0;">${new Date(report.timestamp).toLocaleString()}</p>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        
        marker.on('click', () => {
          setSelectedReport(report);
        });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [damageReports]);

  const handleStyleChange = (event) => {
    setMapStyle(event.target.value);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'High': return theme.palette.error.main;
      case 'Medium': return theme.palette.warning.main;
      case 'Low': return theme.palette.info.main;
      default: return theme.palette.primary.main;
    }
  };

  return (
    <>
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Stack direction="row" spacing={1}>
            <Chip icon={<WarningIcon />} label="High Severity" color="error" />
            <Chip icon={<WarningIcon />} label="Medium Severity" color="warning" />
            <Chip icon={<WarningIcon />} label="Low Severity" color="info" />
          </Stack>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Map Style</InputLabel>
            <Select
              value={mapStyle}
              label="Map Style"
              onChange={handleStyleChange}
              startAdornment={<LayersIcon sx={{ mr: 1, color: theme.palette.primary.main }} />}
            >
              {mapStyles.map(style => (
                <MenuItem key={style.value} value={style.value}>
                  {style.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ height: '70vh', width: '100%', borderRadius: 1, overflow: 'hidden' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
        </Box>
      </Paper>
    </>
  );
}

export default MapView;