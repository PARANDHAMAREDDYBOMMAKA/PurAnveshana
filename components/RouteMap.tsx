'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

interface RouteMapProps {
  destinationLat: number
  destinationLng: number
  destinationName: string
}

// Bengaluru coordinates
const BENGALURU_LAT = 12.9716
const BENGALURU_LNG = 77.5946

export default function RouteMap({ destinationLat, destinationLng, destinationName }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [routeDistance, setRouteDistance] = useState<string>('')
  const [routeDuration, setRouteDuration] = useState<string>('')

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map with mobile-friendly options
    const map = L.map(mapRef.current, {
      // Mobile-optimized settings
      touchZoom: true, // Enable pinch zoom on mobile
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      zoomControl: true, // Show zoom controls (helpful on mobile)
      attributionControl: true,
    }).setView([BENGALURU_LAT, BENGALURU_LNG], 7)

    // Add tile layer - Using OpenStreetMap with mobile-friendly configuration
    // Using OSM France HOT tiles which are more permissive and work on mobile
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 20,
      subdomains: ['a', 'b', 'c'],
      // Mobile optimization settings
      detectRetina: true,
      updateWhenIdle: false,
      updateWhenZooming: false,
      keepBuffer: 2,
    }).addTo(map)

    // Custom marker icons
    const startIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative;">
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: 4px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style="transform: rotate(45deg);">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    })

    const destIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative;">
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            border: 4px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style="transform: rotate(45deg);">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    })

    // Add markers
    L.marker([BENGALURU_LAT, BENGALURU_LNG], { icon: startIcon })
      .addTo(map)
      .bindPopup('<div style="font-weight: bold; color: #059669;">🚀 Start: Bengaluru</div>')

    L.marker([destinationLat, destinationLng], { icon: destIcon })
      .addTo(map)
      .bindPopup(`<div style="font-weight: bold; color: #ea580c;">🏛️ Destination: ${destinationName}</div>`)

    // Add routing with mobile-friendly configuration
    const routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(BENGALURU_LAT, BENGALURU_LNG),
        L.latLng(destinationLat, destinationLng)
      ],
      routeWhileDragging: false, // Disable on mobile for better performance
      showAlternatives: false, // Hide alternatives on mobile to reduce clutter
      fitSelectedRoutes: true,
      addWaypoints: false, // Prevent adding waypoints on mobile
      lineOptions: {
        styles: [
          { color: '#dc2626', opacity: 1, weight: 7 },
          { color: '#fef3c7', opacity: 0.8, weight: 10 },
          { color: '#7c2d12', opacity: 0.6, weight: 13 }
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      createMarker: function() { return null; }, // Don't create default markers
      // Hide the instruction container on mobile
      show: false,
      collapsible: false,
    }).addTo(map)

    // Listen for route calculation to get distance and duration
    routingControl.on('routesfound', function(e: any) {
      const routes = e.routes
      const summary = routes[0].summary
      // Convert distance to km and duration to hours/minutes
      const distanceKm = (summary.totalDistance / 1000).toFixed(1)
      const hours = Math.floor(summary.totalTime / 3600)
      const minutes = Math.round((summary.totalTime % 3600) / 60)

      setRouteDistance(`${distanceKm} km`)
      setRouteDuration(hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`)
    })

    // Remove the routing instructions panel for cleaner mobile view
    // Keep only the route line on the map
    const container = routingControl.getContainer()
    if (container) {
      // Always hide the default panel - we'll show our custom summary instead
      container.style.display = 'none'
    }

    mapInstanceRef.current = map

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [destinationLat, destinationLng, destinationName])

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg"
        style={{
          minHeight: '400px',
          height: 'clamp(400px, 60vh, 700px)'
        }}
      />

      {/* Route Summary Card - Clean mobile-friendly design */}
      {routeDistance && routeDuration && (
        <div className="mt-4 p-4 bg-linear-to-r from-orange-500 to-amber-600 rounded-lg shadow-lg">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div>
                <p className="text-xs sm:text-sm opacity-90">Route Distance</p>
                <p className="text-lg sm:text-xl font-bold">{routeDistance}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs sm:text-sm opacity-90">Estimated Time</p>
                <p className="text-lg sm:text-xl font-bold">{routeDuration}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile-friendly map controls hint */}
      <div className="md:hidden mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700 font-medium flex items-start gap-2">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Use two fingers to zoom and pan the map on mobile</span>
        </p>
      </div>
    </div>
  )
}
