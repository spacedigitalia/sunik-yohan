import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { AlertCircle, Globe, MapPin, Clock, Wifi, Building2 } from "lucide-react"

import { useEffect, useState } from "react"

interface LocationData {
    ip: string;
    city: string;
    region: string;
    country_name: string;
    postal: string;
    latitude: number;
    longitude: number;
    timezone: string;
    org: string;
    asn: string;
}

export default function AccessDenied() {
    const [ipAddress, setIpAddress] = useState<string>("Loading...")
    const [locationData, setLocationData] = useState<LocationData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchIpInfo = async () => {
            try {
                setLoading(true)
                const response = await fetch('https://api.ipify.org?format=json')
                const data = await response.json()
                setIpAddress(data.ip)

                // Fetch detailed location data
                const locationResponse = await fetch(`https://ipapi.co/${data.ip}/json/`)
                const locationData = await locationResponse.json()
                setLocationData(locationData)
            } catch (error) {
                setIpAddress("Unable to fetch IP")
                setLocationData(null)
            } finally {
                setLoading(false)
            }
        }

        fetchIpInfo()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative overflow-hidden">
            {/* Decorative SVG Pattern */}
            <div className="absolute inset-0 -z-10 opacity-10">
                <svg
                    className="absolute inset-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern
                            id="grid"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M 40 0 L 0 0 0 40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Decorative Circles */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <Card className="w-[500px] shadow-lg backdrop-blur-sm bg-white/80">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
                    <CardDescription className="text-gray-500">
                        You don't have permission to access this page
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        {loading ? (
                            <div className="text-sm text-gray-500">Loading location data...</div>
                        ) : locationData ? (
                            <div className="space-y-3 text-left">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Globe className="h-4 w-4" />
                                    <span>IP Address: {ipAddress}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    <span>Location: {locationData.city}, {locationData.region}, {locationData.country_name} ({locationData.postal})</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="h-4 w-4" />
                                    <span>Timezone: {locationData.timezone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Wifi className="h-4 w-4" />
                                    <span>ISP: {locationData.org}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Building2 className="h-4 w-4" />
                                    <span>ASN: {locationData.asn}</span>
                                </div>
                                <div className="mt-4">
                                    <div className="text-xs text-gray-500 mb-2">
                                        Coordinates: {locationData.latitude}, {locationData.longitude}
                                    </div>
                                    <div className="w-full h-[200px] rounded-lg overflow-hidden border border-gray-200">
                                        <iframe
                                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${locationData.latitude},${locationData.longitude}&zoom=12`}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">Unable to fetch location data</div>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}