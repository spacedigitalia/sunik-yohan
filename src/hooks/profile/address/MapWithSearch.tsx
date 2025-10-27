import React, { useEffect, useRef, useState, useCallback } from 'react';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Search, Loader2, Navigation } from "lucide-react";

import { toast } from "sonner";

// Fix for default marker icon
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationData {
    lat: number;
    lng: number;
    address: string;
    province: string;
    city: string;
    postalCode: string;
}

interface MapWithSearchProps {
    onLocationSelect: (location: LocationData) => void;
}

const MapWithSearch: React.FC<MapWithSearchProps> = ({ onLocationSelect }) => {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [marker, setMarker] = useState<L.Marker | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const searchLocation = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id&limit=5`,
                {
                    headers: {
                        'Accept-Language': 'id',
                        'User-Agent': 'SunikYohan/1.0'
                    }
                }
            );

            if (!response.ok) throw new Error('Search failed');

            const data = await response.json();
            if (data.length === 0) {
                toast.error('Lokasi tidak ditemukan');
                setSearchResults([]);
                setShowResults(false);
                return;
            }

            setSearchResults(data);
            setShowResults(true);

        } catch (error) {
            console.error('Error searching location:', error);
            toast.error('Gagal mencari lokasi');
            setSearchResults([]);
            setShowResults(false);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleSearch = useCallback((query: string) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            searchLocation(query);
        }, 500); // 500ms delay
    }, [searchLocation]);

    const handleResultSelect = async (result: any) => {
        if (!mapRef.current) {
            console.error('Map not initialized');
            return;
        }

        console.log('Selected result:', result);
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        // Remove existing marker
        if (marker) {
            console.log('Removing existing marker');
            marker.remove();
        }

        // Create new marker
        console.log('Creating new marker at:', lat, lon);
        const newMarker = L.marker([lat, lon], {
            icon: DefaultIcon,
            draggable: true
        }).addTo(mapRef.current);
        setMarker(newMarker);

        // Get address details immediately
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'id',
                        'User-Agent': 'SunikYohan/1.0'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to get address details');

            const data = await response.json();
            const address = data.address;

            const locationData: LocationData = {
                lat: lat,
                lng: lon,
                address: data.display_name,
                province: address.state || '',
                city: address.city || address.county || '',
                postalCode: address.postcode || ''
            };

            setSearchQuery(data.display_name);
            setShowResults(false);
            onLocationSelect(locationData);
            newMarker.bindPopup(data.display_name).openPopup();
        } catch (error) {
            console.error('Error getting address details:', error);
            toast.error('Gagal mendapatkan detail alamat');
        }

        // Update map view
        console.log('Updating map view');
        if (mapRef.current) {
            mapRef.current.setView([lat, lon], 15);
        }

        // Add dragend event handler
        newMarker.on('dragend', async (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            const newLat = position.lat;
            const newLng = position.lng;

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1`,
                    {
                        headers: {
                            'Accept-Language': 'id',
                            'User-Agent': 'SunikYohan/1.0'
                        }
                    }
                );

                if (!response.ok) throw new Error('Failed to get address details');

                const data = await response.json();
                const address = data.address;

                const locationData: LocationData = {
                    lat: newLat,
                    lng: newLng,
                    address: data.display_name,
                    province: address.state || '',
                    city: address.city || address.county || '',
                    postalCode: address.postcode || ''
                };

                setSearchQuery(data.display_name);
                onLocationSelect(locationData);
                marker.bindPopup(data.display_name).openPopup();
            } catch (error) {
                console.error('Error getting address details:', error);
                toast.error('Gagal mendapatkan detail alamat');
            }
        });
    };

    const getUserLocation = useCallback(async () => {
        if (!mapRef.current) return;

        setIsGettingLocation(true);
        try {
            // First try to get a quick position
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            const { latitude: lat, longitude: lng } = position.coords;

            // Start watching position for better accuracy
            const watchId = navigator.geolocation.watchPosition(
                async (newPosition) => {
                    const { latitude: newLat, longitude: newLng } = newPosition.coords;

                    // Update marker position
                    if (marker) {
                        marker.setLatLng([newLat, newLng]);
                    } else {
                        const newMarker = L.marker([newLat, newLng], {
                            icon: DefaultIcon,
                            draggable: true
                        }).addTo(mapRef.current!);
                        setMarker(newMarker);

                        // Add dragend event handler
                        newMarker.on('dragend', async (e) => {
                            const marker = e.target;
                            const position = marker.getLatLng();
                            const newLat = position.lat;
                            const newLng = position.lng;

                            try {
                                const response = await fetch(
                                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1`,
                                    {
                                        headers: {
                                            'Accept-Language': 'id',
                                            'User-Agent': 'SunikYohan/1.0'
                                        }
                                    }
                                );

                                if (!response.ok) throw new Error('Failed to get address details');

                                const data = await response.json();
                                const address = data.address;

                                const locationData: LocationData = {
                                    lat: newLat,
                                    lng: newLng,
                                    address: data.display_name,
                                    province: address.state || '',
                                    city: address.city || address.county || '',
                                    postalCode: address.postcode || ''
                                };

                                setSearchQuery(data.display_name);
                                onLocationSelect(locationData);
                                marker.bindPopup(data.display_name).openPopup();
                            } catch (error) {
                                console.error('Error getting address details:', error);
                                toast.error('Gagal mendapatkan detail alamat');
                            }
                        });
                    }

                    // Update map view
                    mapRef.current?.setView([newLat, newLng], 18);

                    // Get address details
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1`,
                            {
                                headers: {
                                    'Accept-Language': 'id',
                                    'User-Agent': 'SunikYohan/1.0'
                                }
                            }
                        );

                        if (!response.ok) throw new Error('Failed to get address details');

                        const data = await response.json();
                        const address = data.address;

                        const locationData: LocationData = {
                            lat: newLat,
                            lng: newLng,
                            address: data.display_name,
                            province: address.state || '',
                            city: address.city || address.county || '',
                            postalCode: address.postcode || ''
                        };

                        setSearchQuery(data.display_name);
                        onLocationSelect(locationData);
                        if (marker) {
                            marker.bindPopup(data.display_name).openPopup();
                        }
                    } catch (error) {
                        console.error('Error getting address details:', error);
                    }
                },
                (error) => {
                    console.error('Error watching position:', error);
                    navigator.geolocation.clearWatch(watchId);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );

            // Stop watching after 10 seconds
            setTimeout(() => {
                navigator.geolocation.clearWatch(watchId);
                setIsGettingLocation(false);
                toast.success('Lokasi berhasil diperbarui');
            }, 10000);

        } catch (error) {
            console.error('Error getting location:', error);
            if (error instanceof GeolocationPositionError) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error('Akses lokasi ditolak. Mohon izinkan akses lokasi di pengaturan browser Anda.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error('Informasi lokasi tidak tersedia');
                        break;
                    case error.TIMEOUT:
                        toast.error('Permintaan lokasi timeout');
                        break;
                    default:
                        toast.error('Gagal mendapatkan lokasi');
                }
            } else {
                toast.error('Gagal mendapatkan detail alamat');
            }
            setIsGettingLocation(false);
        }
    }, [marker, onLocationSelect]);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        // Initialize map
        const map = L.map(mapContainerRef.current).setView([-6.2088, 106.8456], 13);
        mapRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add click handler
        map.on('click', async (e) => {
            const { lat, lng } = e.latlng;
            console.log('Map clicked:', lat, lng);

            // Remove existing marker
            if (marker) {
                marker.remove();
            }

            // Create new marker
            const newMarker = L.marker([lat, lng], {
                icon: DefaultIcon,
                draggable: true
            }).addTo(map);
            setMarker(newMarker);

            // Get address details immediately
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                    {
                        headers: {
                            'Accept-Language': 'id',
                            'User-Agent': 'SunikYohan/1.0'
                        }
                    }
                );

                if (!response.ok) throw new Error('Failed to get address details');

                const data = await response.json();
                const address = data.address;

                const locationData: LocationData = {
                    lat,
                    lng,
                    address: data.display_name,
                    province: address.state || '',
                    city: address.city || address.county || '',
                    postalCode: address.postcode || ''
                };

                setSearchQuery(data.display_name);
                onLocationSelect(locationData);
                newMarker.bindPopup(data.display_name).openPopup();
            } catch (error) {
                console.error('Error getting address details:', error);
                toast.error('Gagal mendapatkan detail alamat');
            }
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div className="relative w-full h-full">
            <div className="absolute top-4 right-4 z-[9999] w-64">
                <div className="relative flex gap-2">
                    <div className="relative flex-1 bg-white">
                        <Input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Cari lokasi..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearchQuery(value);
                                handleSearch(value);
                            }}
                            disabled={isSearching}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (searchInputRef.current) {
                                        searchLocation(searchInputRef.current.value);
                                    }
                                }
                            }}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                    <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={getUserLocation}
                        disabled={isGettingLocation}
                        title="Gunakan lokasi saya"
                    >
                        {isGettingLocation ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Navigation className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        type="button"
                        size="icon"
                        onClick={() => {
                            if (searchInputRef.current) {
                                searchLocation(searchInputRef.current.value);
                            }
                        }}
                        disabled={isSearching}
                    >
                        {isSearching ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Search className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((result, index) => (
                            <button
                                key={index}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                onClick={() => handleResultSelect(result)}
                            >
                                {result.display_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
        </div>
    );
};

export default MapWithSearch;