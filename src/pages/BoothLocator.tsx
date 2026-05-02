import { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Accessibility, 
  Eye, 
  Mic, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  Footprints,
  CornerUpRight,
  CornerUpLeft,
  Map,
  Flag,
  Users,
  Info,
  Globe,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import EpicScanner from '../components/EpicScanner';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons
const createCrowdIcon = (level: string) => {
  const iconMarkup = {
    High: `
      <div class="relative flex items-center justify-center w-12 h-12 group hover:-translate-y-1 hover:scale-110 transition-all duration-300">
        <div class="absolute inset-2 rounded-full animate-ping opacity-60 bg-red-400 group-hover:opacity-80"></div>
        <div class="relative w-9 h-9 rounded-full border-[3px] border-white shadow-xl z-10 bg-red-500 flex items-center justify-center group-hover:shadow-2xl">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
      </div>
    `,
    Medium: `
      <div class="relative flex items-center justify-center w-10 h-10 group hover:-translate-y-1 hover:scale-110 transition-all duration-300">
        <div class="absolute inset-2 rounded-full animate-pulse opacity-40 bg-amber-400 group-hover:opacity-60"></div>
        <div class="relative w-8 h-8 rounded-full border-[3px] border-white shadow-lg z-10 bg-amber-500 flex items-center justify-center group-hover:shadow-xl">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
      </div>
    `,
    Low: `
      <div class="relative flex items-center justify-center w-10 h-10 group hover:-translate-y-1 hover:scale-110 transition-all duration-300">
        <div class="absolute inset-2 rounded-full animate-pulse opacity-30 bg-emerald-400 group-hover:opacity-50"></div>
        <div class="relative w-8 h-8 rounded-full border-[3px] border-white shadow-lg z-10 bg-emerald-500 flex items-center justify-center group-hover:shadow-xl">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>
    `
  };

  return L.divIcon({
    className: 'custom-leaflet-icon-crowd',
    html: iconMarkup[level as keyof typeof iconMarkup] || iconMarkup.Low,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

const createPulsatingIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-icon-selected',
    html: `
      <div class="relative flex items-center justify-center w-16 h-16 group hover:scale-105 transition-transform duration-300">
        <div class="absolute inset-0 rounded-full animate-ping opacity-40" style="background-color: ${color};"></div>
        <div class="absolute inset-1 rounded-full animate-pulse opacity-30 scale-150 blur-md" style="background-color: ${color};"></div>
        <div class="relative w-12 h-12 rounded-full border-[4px] border-white shadow-[0_0_20px_rgba(59,130,246,0.8)] z-20 flex items-center justify-center ring-4 ring-blue-500/30" style="background-color: ${color};">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      </div>
    `,
    iconSize: [64, 64],
    iconAnchor: [32, 32],
  });
};

const SelectedIcon = createPulsatingIcon('#3B82F6');

const createIcon = (color: string, sizeClass: string = "w-6 h-6") => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div class="${sizeClass}" style="background-color: ${color}; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const UserIcon = createIcon('#4F46E5');

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Helper component to center map with smooth transitions
function MapUpdater({ center, zoom }: { center: { lat: number; lng: number } | null, zoom: number }) {
  const map = useMap();
  const prevCenterRef = useRef<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (center) {
      const isInitialInit = !prevCenterRef.current;
      const hasMoved = prevCenterRef.current?.lat !== center.lat || prevCenterRef.current?.lng !== center.lng;
      
      if (isInitialInit) {
        map.setView([center.lat, center.lng], zoom);
      } else if (hasMoved) {
        map.flyTo([center.lat, center.lng], zoom, {
          animate: true,
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
      prevCenterRef.current = center;
    }
  }, [center, map, zoom]);
  return null;
}

interface NavigationStep {
  instruction: string;
  landmark?: string;
  distance?: string;
  iconType?: 'walk' | 'turn-left' | 'turn-right' | 'landmark' | 'arrive';
}

interface Booth {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  distance: string;
  accessible: boolean;
  accessibilityFeatures: string[];
  time: string;
  landmark: string;
  navigationSteps: NavigationStep[];
  crowdLevel: 'Low' | 'Medium' | 'High';
  waitTime: string;
  capacity?: number;
  currentVoters?: number;
}

export default function BoothLocator() {
  const { t } = useTranslation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number}>({ lat: 28.6139, lng: 77.2090 });
  const [mapZoom, setMapZoom] = useState(13);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'location' | 'voterId'>('location');
  const [distanceFilter, setDistanceFilter] = useState(5);
  const [crowdFilter, setCrowdFilter] = useState<string>('All');
  const [accessFilter, setAccessFilter] = useState<string>('All');
  const [isFirstVoter, setIsFirstVoter] = useState(false);
  const [highlightedBoothId, setHighlightedBoothId] = useState<number | null>(null);
  const [showLiveDirections, setShowLiveDirections] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const speakText = (text: string) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const parsedDistance = (distStr: string) => parseFloat(distStr);

  const filteredBooths = booths.filter(booth => {
    const numDist = parsedDistance(booth.distance);
    if (!isNaN(numDist) && numDist > distanceFilter) return false;
    if (crowdFilter !== 'All' && booth.crowdLevel !== crowdFilter) return false;
    if (accessFilter !== 'All' && !booth.accessibilityFeatures.includes(accessFilter)) return false;
    return true;
  });

  useEffect(() => {
    if (!selectedBooth && highlightedBoothId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`booth-card-${highlightedBoothId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [highlightedBoothId, selectedBooth]);

  useEffect(() => {
    if (selectedBooth) {
      setMapCenter({ lat: selectedBooth.lat, lng: selectedBooth.lng });
      setMapZoom(16);
    }
  }, [selectedBooth]);

  useEffect(() => {
    const initLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(pos);
            setMapCenter(pos);
            fetchBooths(pos);
          },
          () => {
            fetchBooths({ lat: 28.6139, lng: 77.2090 });
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        fetchBooths({ lat: 28.6139, lng: 77.2090 });
        setLoading(false);
      }
    };

    initLocation();
  }, []);

  useEffect(() => {
    // Real-time crowd update simulation
    const interval = setInterval(() => {
      setBooths(prevBooths => 
        prevBooths.map(booth => {
          // 20% chance to update each booth
          if (Math.random() > 0.8) {
            const levels: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
            const currentIdx = levels.indexOf(booth.crowdLevel);
            // Move up or down by 1 level
            const delta = Math.random() > 0.5 ? 1 : -1;
            const newIdx = Math.max(0, Math.min(2, currentIdx + delta));
            const newLevel = levels[newIdx];
            
            const waitMinutes = newLevel === 'High' ? 120 + Math.floor(Math.random() * 30) : 
                               (newLevel === 'Medium' ? 45 + Math.floor(Math.random() * 15) : 10 + Math.floor(Math.random() * 5));

            return {
              ...booth,
              crowdLevel: newLevel,
              waitTime: `${waitMinutes} mins`,
              currentVoters: booth.capacity ? Math.floor(booth.capacity * (newLevel === 'High' ? 0.9 : (newLevel === 'Medium' ? 0.5 : 0.2))) : undefined
            };
          }
          return booth;
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [booths.length]);

  useEffect(() => {
    // Keep selected booth in sync with real-time updates
    if (selectedBooth) {
      const updated = booths.find(b => b.id === selectedBooth.id);
      if (updated && (updated.crowdLevel !== selectedBooth.crowdLevel || updated.waitTime !== selectedBooth.waitTime)) {
        setSelectedBooth(updated);
      }
    }
  }, [booths, selectedBooth]);

  const fetchBooths = async (center: { lat: number; lng: number }) => {
    setLoading(true);
    try {
      // Expanded search to include more common polling station types in India
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"~"school|community_centre|townhall|library|college|police"](around:8000, ${center.lat}, ${center.lng});
          way["amenity"~"school|community_centre|townhall|library|college|police"](around:8000, ${center.lat}, ${center.lng});
          relation["amenity"~"school|community_centre|townhall|library|college|police"](around:8000, ${center.lat}, ${center.lng});
          node["voting_place"="yes"](around:8000, ${center.lat}, ${center.lng});
          node["amenity"="polling_station"](around:8000, ${center.lat}, ${center.lng});
        );
        out center;
      `;
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`
      });
      const data = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        const currentHour = new Date().getHours();
        const isPeak = (currentHour >= 8 && currentHour <= 11) || (currentHour >= 16 && currentHour <= 18);

        const realBooths = data.elements.map((el: any, index: number) => {
          const lat = el.lat || el.center?.lat;
          const lng = el.lon || el.center?.lon;
          const dist = calculateDistance(center.lat, center.lng, lat, lng);
          
          // Real-time queue simulation logic
          const crowdLevel = isPeak 
            ? (index % 3 === 0 ? 'High' : 'Medium') 
            : (index % 5 === 0 ? 'Medium' : 'Low');
          
          const waitMinutes = crowdLevel === 'High' ? 120 : (crowdLevel === 'Medium' ? 45 : 15);
          const capacity = 500 + Math.floor(Math.random() * 1000);

          return {
            id: el.id,
            name: el.tags.name || (el.tags.amenity === 'school' ? 'Government Primary School' : 'Election Polling Station'),
            lat: lat,
            lng: lng,
            address: el.tags['addr:full'] || el.tags['addr:street'] || `Near ${el.tags.name || 'Local Landmark'}`,
            distance: `${dist.toFixed(1)} km`,
            accessible: true,
            accessibilityFeatures: ['Ramp Access', 'Wheelchair Available', 'Priority Line for Seniors'],
            time: "7:00 AM - 6:00 PM (Polling Day)",
            landmark: el.tags['addr:suburb'] || "Local Electoral Ward",
            navigationSteps: [
              { instruction: "Proceed towards building entrance.", iconType: 'walk', distance: `${(dist * 1000).toFixed(0)}m` },
              { instruction: "Look for Election Commission signage.", iconType: 'info' },
              { instruction: "Identify your booth number on the list at entrance.", iconType: 'arrive' }
            ],
            crowdLevel: crowdLevel,
            waitTime: `${waitMinutes} mins`,
            capacity: capacity,
            currentVoters: Math.floor(capacity * (crowdLevel === 'High' ? 0.85 : (crowdLevel === 'Medium' ? 0.45 : 0.15)))
          };
        });
        setBooths(realBooths.sort((a: any, b: any) => parseFloat(a.distance) - parseFloat(b.distance)).slice(0, 12));
      } else {
        generateMockBooths(center);
      }
    } catch (error) {
      console.error("Error fetching real booths:", error);
      generateMockBooths(center);
    } finally {
      setLoading(false);
    }
  };

  const generateMockBooths = (center: { lat: number; lng: number }) => {
    const mockBooths: Booth[] = [
      {
        id: 1,
        name: "St. Xavier's Primary School",
        lat: center.lat + 0.005,
        lng: center.lng + 0.005,
        address: "Block C, Near Central Park, Outer Circle",
        distance: "0.8 km",
        accessible: true,
        accessibilityFeatures: ['Ramp Access', 'Wheelchair Available', 'Sign Language Support'],
        time: "7:00 AM - 6:00 PM",
        landmark: "Next to the Big Banyan Tree",
        navigationSteps: [
          { instruction: "Head south on the main road.", iconType: 'walk', distance: "200m" },
          { instruction: "Turn right at the junction.", landmark: "Look for the large Peepul tree.", iconType: 'turn-right', distance: "50m" },
          { instruction: "Enter through Gate 3.", landmark: "Blue building on your left.", iconType: 'arrive', distance: "10m" }
        ],
        crowdLevel: 'Low',
        waitTime: '15 mins',
        capacity: 800,
        currentVoters: 120
      },
      {
        id: 2,
        name: "Government Degree College",
        lat: center.lat - 0.008,
        lng: center.lng + 0.012,
        address: "Civic Center Road, Sector 4",
        distance: "1.4 km",
        accessible: true,
        accessibilityFeatures: ['Ramp Access', 'Braille Signage', 'Tactile Paving'],
        time: "7:00 AM - 6:00 PM",
        landmark: "Opposite Police Station",
        navigationSteps: [
          { instruction: "Follow Civic Center Road towards Sector 4.", iconType: 'walk', distance: "400m" },
          { instruction: "Cross the road securely at the zebra crossing.", landmark: "Opposite Sector 4 Police Station.", iconType: 'landmark', distance: "20m" },
          { instruction: "Enter through the main parking gate.", iconType: 'arrive' }
        ],
        crowdLevel: 'Medium',
        waitTime: '45 mins',
        capacity: 1500,
        currentVoters: 650
      },
      {
        id: 3,
        name: "Community Hall Precinct",
        lat: center.lat + 0.015,
        lng: center.lng - 0.010,
        address: "Industrial Area Gate 2",
        distance: "2.1 km",
        accessible: false,
        accessibilityFeatures: ['Wheelchair Available'],
        time: "7:00 AM - 6:00 PM",
        landmark: "Behind the Metro Station",
        navigationSteps: [
          { instruction: "Walk past Industrial Area Gate 2.", iconType: 'walk', distance: "500m" },
          { instruction: "Use the pedestrian subway to cross to the other side.", landmark: "Behind the Metro Station.", iconType: 'landmark', distance: "100m" },
          { instruction: "The Community Hall is centrally located in the precinct.", iconType: 'arrive', distance: "50m" }
        ],
        crowdLevel: 'High',
        waitTime: '120 mins',
        capacity: 1200,
        currentVoters: 1050
      }
    ];

    setBooths(mockBooths);
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    
    if (searchMode === 'location') {
      const fetchGeocode = async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
          const data = await res.json();
          if (data && data.length > 0) {
            const loc = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
            setMapCenter(loc);
            setMapZoom(13);
            fetchBooths(loc);
          } else {
            console.error("Location not found");
          }
        } catch (err) {
          console.error("Geocoding failed", err);
        }
      };
      
      fetchGeocode();
    } else {
      // Simulate Voter ID lookup
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (booths.length > 0) {
          const index = searchQuery.length % booths.length;
          const targetBooth = booths[index];
          setSelectedBooth(targetBooth);
          setMapCenter({ lat: targetBooth.lat, lng: targetBooth.lng });
          setMapZoom(16);
        }
      }, 700);
    }
  };

  const handleScanSuccess = (data: any) => {
    setIsScannerOpen(false);
    setSearchQuery(data.epicNumber || data.name);
    setSearchMode('voterId');
    
    // Attempt to find booth by constituency or name
    const foundBooth = booths.find(b => 
      b.name.toLowerCase().includes(data.constituency.toLowerCase()) || 
      b.address.toLowerCase().includes(data.constituency.toLowerCase())
    );

    if (foundBooth) {
      setSelectedBooth(foundBooth);
      setMapCenter({ lat: foundBooth.lat, lng: foundBooth.lng });
      setMapZoom(16);
      speakText(`Scanned ${data.name}. Found your booth at ${foundBooth.name}.`);
    } else {
      handleSearch();
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] md:h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-slate-50">
      <AnimatePresence>
        {isScannerOpen && (
          <EpicScanner 
            onScanSuccess={handleScanSuccess} 
            onClose={() => setIsScannerOpen(false)} 
          />
        )}
      </AnimatePresence>
      <div className="w-full md:w-96 flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.04)] z-20 md:overflow-y-auto max-h-[60vh] md:max-h-full">
        <div className="p-6 bg-[#FF6500] text-white rounded-br-[32px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight leading-none mb-1">BoothFinder AI</h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-orange-100">Your Election Guide</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
            <p className="text-sm font-medium leading-relaxed italic">
              {loading 
                ? "Locating nearest verified polling station buildings..." 
                : selectedBooth 
                  ? `Found it! ${selectedBooth.name} is a designated booth for your area.`
                  : "I'm searching for schools and government buildings that typically serve as polling stations."}
            </p>
          </div>
        </div>

        <div className="p-4 bg-orange-50/50 border-b border-orange-100/50 flex gap-3 px-6">
          <div className="shrink-0 text-[#FF6500] mt-0.5">
            <Info className="h-4 w-4" />
          </div>
          <p className="text-[10px] font-medium text-slate-600 leading-relaxed">
            <strong>Verified Locations:</strong> We use real architectural data (schools, centers) where booths are usually set up. Check your <strong>Election Slip</strong> for your final room/booth number.
          </p>
        </div>

        <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
          {searchMode === 'location' ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Search Radius</span>
                <span className="text-[10px] font-bold text-[#FF6500] bg-orange-50 px-2 py-0.5 rounded-full">{distanceFilter} km</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[1, 2, 5, 10, 25].map(dist => (
                  <button
                    key={dist}
                    onClick={() => setDistanceFilter(dist)}
                    className={cn(
                      "whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border",
                      distanceFilter === dist 
                        ? "bg-[#0B0F2E] text-white border-[#0B0F2E] shadow-[0_4px_14px_rgba(11,15,46,0.3)]" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {dist}km
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="relative w-1/2">
                   <select 
                    value={crowdFilter} 
                    onChange={e => setCrowdFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat"
                  >
                    <option value="All">All Crowd Levels</option>
                    <option value="Low">Low Crowd</option>
                    <option value="Medium">Medium Crowd</option>
                    <option value="High">High Crowd</option>
                  </select>
                </div>
                <div className="relative w-1/2">
                  <select 
                    value={accessFilter} 
                    onChange={e => setAccessFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat"
                  >
                    <option value="All">All Features</option>
                    <option value="Ramp Access">Ramp Access</option>
                    <option value="Sign Language Support">Sign Language Support</option>
                    <option value="Wheelchair Available">Wheelchair Available</option>
                    <option value="Braille Signage">Braille Signage</option>
                    <option value="Tactile Paving">Tactile Paving</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100/50">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Voter ID Lookup Mode</h4>
              <p className="text-xs text-blue-800/70 leading-relaxed font-medium"> Use the top search bar to enter your EPIC number. Our system will map the exact building and room for your voting precinct. </p>
            </div>
          )}
        </div>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {!selectedBooth ? (
              <motion.div 
                key="list"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="p-6 space-y-6"
              >
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Nearby Booths</h3>
                  <div className="grid gap-3">
                    {filteredBooths.length === 0 ? (
                      <div className="text-center py-8 bg-slate-100 rounded-2xl border border-slate-200 border-dashed">
                        <p className="text-sm font-bold text-slate-500">No booths match filters</p>
                      </div>
                    ) : (
                      filteredBooths.map((booth, idx) => (
                        <motion.button
                          key={booth.id}
                        id={`booth-card-${booth.id}`}
                        layoutId={`booth-card-${booth.id}`}
                        animate={highlightedBoothId === booth.id ? { scale: 1.02 } : { scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          speakText(`Selected booth ${booth.name}, located ${booth.distance} away. Address: ${booth.address}. Crowd level is ${booth.crowdLevel}.`);
                          setSelectedBooth(booth);
                          setMapCenter({ lat: booth.lat, lng: booth.lng });
                          setMapZoom(16);
                        }}
                        onMouseEnter={() => speakText(`Booth ${booth.name}, located ${booth.distance} away. Address: ${booth.address}. Crowd level is ${booth.crowdLevel}.`)}
                        onFocus={() => speakText(`Booth ${booth.name}, located ${booth.distance} away. Address: ${booth.address}. Crowd level is ${booth.crowdLevel}.`)}
                        aria-label={`Select booth ${booth.name}, located ${booth.distance} away. Address: ${booth.address}.`}
                        className={cn(
                          "w-full text-left p-4 rounded-[24px] bg-white border transition-all duration-300 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#FF6500]",
                          highlightedBoothId === booth.id ? "border-[#FF6500] ring-2 ring-orange-100 shadow-[0_8px_30px_rgba(255,101,0,0.12)]" : "border-slate-200 hover:border-[#FF6500] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2 relative z-10">
                          <h4 className="font-bold text-[#0B0F2E] group-hover:text-[#FF6500] transition-colors truncate pr-2">{booth.name}</h4>
                          <div className="flex gap-1.5 shrink-0">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider h-max",
                              booth.crowdLevel === 'Low' ? "bg-emerald-50 text-[#00796B]" : 
                              booth.crowdLevel === 'Medium' ? "bg-orange-50 text-[#FF6500]" : 
                              "bg-red-50 text-red-600"
                            )}>
                              {booth.crowdLevel}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-50 text-slate-500 h-max">
                              {booth.distance}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 flex items-center gap-1 relative z-10">
                          <MapPin className="h-3 w-3 shrink-0" /> {booth.address}
                        </p>
                      </motion.button>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-amber-600">Important Checklist</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Carry valid Voter ID or alternate ID",
                      "Check your Serial Number in Voter List",
                      "Queue up early (7 AM onwards)",
                      "Avoid mobile phones inside the booth"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-medium text-amber-800/80">
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="detail"
                layoutId={`booth-card-${selectedBooth.id}`}
                className="p-6 bg-white shrink-0 min-h-max"
              >
                <button 
                  onClick={() => setSelectedBooth(null)}
                  className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-600 mb-6 hover:gap-2 transition-all"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to list
                </button>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">{selectedBooth.name}</h2>
                    <div className="flex items-start gap-2 mb-4 bg-slate-100/50 p-3 rounded-xl border border-slate-100">
                      <MapPin className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                      <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                        {selectedBooth.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                         <Navigation className="h-3.5 w-3.5 text-blue-500" /> {selectedBooth.distance} away
                       </span>
                       <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                         <Accessibility className="h-3.5 w-3.5 text-emerald-500" /> Accessible
                       </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Voting Time</span>
                      <p className="text-xs font-bold text-slate-900">{selectedBooth.time}</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-2">
                        <Users className="h-3 w-3" /> Expected Crowd
                      </span>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                            selectedBooth.crowdLevel === 'Low' ? "bg-emerald-50 text-[#00796B]" : 
                            selectedBooth.crowdLevel === 'Medium' ? "bg-orange-50 text-[#FF6500]" : 
                            "bg-red-50 text-red-600"
                          )}>
                            {selectedBooth.crowdLevel}
                          </div>
                          {selectedBooth.waitTime && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-white rounded-md text-[10px] font-black uppercase tracking-wider animate-pulse">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              Live: {selectedBooth.waitTime}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3].map((level) => (
                            <div 
                              key={level} 
                              className={cn(
                                "h-3 w-1 rounded-full",
                                (selectedBooth.crowdLevel === 'Low' && level <= 1) ? "bg-[#00796B]" :
                                (selectedBooth.crowdLevel === 'Medium' && level <= 2) ? "bg-[#FF6500]" :
                                (selectedBooth.crowdLevel === 'High' && level <= 3) ? "bg-red-500" :
                                "bg-slate-200"
                              )}
                            />
                          ))}
                        </div>
                        {selectedBooth.currentVoters && selectedBooth.capacity && (
                          <div className="mt-3">
                            <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                              <span>Live Capacity</span>
                              <span>{Math.round((selectedBooth.currentVoters / selectedBooth.capacity) * 100)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(selectedBooth.currentVoters / selectedBooth.capacity) * 100}%` }}
                                className={cn(
                                  "h-full rounded-full transition-all duration-1000",
                                  selectedBooth.crowdLevel === 'Low' ? "bg-[#00796B]" : 
                                  selectedBooth.crowdLevel === 'Medium' ? "bg-[#FF6500]" : 
                                  "bg-red-500"
                                )}
                              />
                            </div>
                            <p className="text-[9px] text-slate-400 mt-1 font-medium italic">
                              ~{selectedBooth.currentVoters} voters currently at station
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                       <Accessibility className="h-3 w-3" /> Accessibility Features
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedBooth.accessibilityFeatures.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            {feature.includes('Ramp') ? <Accessibility className="h-3.5 w-3.5 text-emerald-600" /> : 
                             feature.includes('Audio') || feature.includes('Language') ? <Mic className="h-3.5 w-3.5 text-emerald-600" /> :
                             feature.includes('Braille') || feature.includes('Eye') ? <Eye className="h-3.5 w-3.5 text-emerald-600" /> :
                             <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                          </div>
                          <span className="text-xs font-bold text-emerald-800">{feature}</span>
                        </div>
                      ))}
                      {!selectedBooth.accessible && selectedBooth.accessibilityFeatures.length === 0 && (
                        <p className="text-xs text-slate-400 italic">No specific accessibility features listed.</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <button 
                      onClick={() => setShowLiveDirections(!showLiveDirections)}
                      className="w-full bg-[#FF6500] text-white rounded-2xl py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(255,101,0,0.3)] hover:bg-[#FF8C38] transition-all active:scale-95"
                    >
                      <Navigation className="h-4 w-4" /> {showLiveDirections ? 'Hide Directions' : 'Get Live Directions'}
                    </button>
                    {isFirstVoter && (
                       <button className="w-full bg-white border-2 border-[#1565C0]/20 text-[#1565C0] rounded-2xl py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#1565C0]/5 transition-all">
                         Show First-Time Voter Guide
                       </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {showLiveDirections && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                            <Navigation className="h-3 w-3" /> Step-by-Step Route
                          </h4>
                          <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:to-emerald-100">
                            {selectedBooth.navigationSteps.map((step, idx) => (
                              <div key={idx} className="relative group">
                                {/* Step Icon / Dot */}
                                <div className={cn(
                                  "absolute -left-8 -top-1 h-6 w-6 rounded-full flex items-center justify-center bg-white shadow-sm border-2 z-10 transition-colors",
                                  idx === 0 ? "border-blue-500 text-blue-500" : 
                                  idx === selectedBooth.navigationSteps.length - 1 ? "border-emerald-500 text-emerald-500" : "border-slate-300 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500"
                                )}>
                                  {step.iconType === 'walk' ? <Footprints className="h-3 w-3" /> :
                                   step.iconType === 'turn-right' ? <CornerUpRight className="h-3 w-3" /> :
                                   step.iconType === 'turn-left' ? <CornerUpLeft className="h-3 w-3" /> :
                                   step.iconType === 'landmark' ? <Map className="h-3 w-3" /> :
                                   step.iconType === 'arrive' ? <Flag className="h-3 w-3" /> :
                                   <div className="h-2 w-2 rounded-full bg-current" />}
                                </div>
                                
                                {/* Step Content */}
                                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 transition-colors group-hover:bg-blue-50/30 group-hover:border-blue-100">
                                  <div className="flex justify-between items-start gap-4">
                                    <p className="text-sm font-bold text-slate-800 leading-snug">
                                      {step.instruction}
                                    </p>
                                    {step.distance && (
                                       <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-400 py-1 px-2 bg-white rounded-md border border-slate-200 shadow-sm">{step.distance}</span>
                                    )}
                                  </div>
                                  
                                  {step.landmark && (
                                    <div className="mt-2 flex items-start gap-2 bg-orange-50/80 p-2.5 rounded-lg border border-orange-100/50">
                                      <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                                      <p className="text-xs font-semibold text-orange-800 leading-tight">
                                        <span className="uppercase text-[9px] tracking-wider text-orange-600/70 block mb-0.5">Nearby Landmark</span>
                                        {step.landmark}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                     <p className="text-[11px] font-bold text-blue-800 leading-relaxed italic">
                       "Don't worry, I'll guide you step-by-step on voting day. Would you like to see what happens inside the booth?"
                     </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-4">
          <button 
            onClick={() => {
              const newState = !audioEnabled;
              setAudioEnabled(newState);
              if (newState && 'speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance("Audio descriptions enabled.");
                window.speechSynthesis.speak(utterance);
              }
            }}
            className="flex items-center justify-between w-full p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-all"
            aria-pressed={audioEnabled}
          >
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-700">Audio Descriptions</span>
            </div>
            <div className={cn(
              "w-8 h-4 rounded-full relative transition-all",
              audioEnabled ? "bg-emerald-500" : "bg-slate-200"
            )}>
              <div className={cn(
                "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm",
                audioEnabled ? "left-4.5" : "left-0.5"
              )} />
            </div>
          </button>

          <button 
            onClick={() => setIsFirstVoter(!isFirstVoter)}
            className="flex items-center justify-between w-full p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-bold text-slate-700">I am a first-time voter</span>
            </div>
            <div className={cn(
              "w-8 h-4 rounded-full relative transition-all",
              isFirstVoter ? "bg-blue-600" : "bg-slate-200"
            )}>
              <div className={cn(
                "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm",
                isFirstVoter ? "left-4.5" : "left-0.5"
              )} />
            </div>
          </button>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3 block">Official Resources</h4>
            <div className="space-y-2">
               <a 
                  href="https://eci.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
               >
                  <ExternalLink className="h-4 w-4" />
                  Election Commission of India (ECI)
               </a>
               <a 
                  href="https://voters.eci.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
               >
                  <ExternalLink className="h-4 w-4" />
                  National Voters' Services Portal (NVSP)
               </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-200 h-[40vh] md:h-auto min-h-[300px]">
        {/* Floating Top Search Bar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-xl z-[1000]">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 p-2 flex flex-col sm:flex-row gap-2">
            <div className="flex bg-slate-100/50 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setSearchMode('location')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all",
                  searchMode === 'location' ? "bg-white shadow-sm text-[#0B0F2E]" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Location
              </button>
              <button
                onClick={() => setSearchMode('voterId')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all",
                  searchMode === 'voterId' ? "bg-white shadow-sm text-[#0B0F2E]" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Voter ID
              </button>
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={searchMode === 'location' ? "Search city, area or pincode..." : "Enter 10-digit Voter ID..."}
                className="w-full bg-transparent border-none py-2.5 pl-10 pr-4 text-sm font-semibold focus:ring-0 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleSearch}
                disabled={loading || !searchQuery}
                className="bg-[#0B0F2E] text-white rounded-xl px-5 py-2.5 flex items-center justify-center font-bold text-xs transition-all hover:bg-[#1A237E] active:scale-95 disabled:opacity-50 shadow-[0_4px_14px_rgba(11,15,46,0.3)]"
              >
                {loading ? <Activity className="h-4 w-4 animate-spin" /> : "Search"}
              </button>
              <button 
                onClick={() => setIsScannerOpen(true)}
                className="bg-[#FF6500]/10 text-[#FF6500] border border-[#FF6500]/20 rounded-xl px-3 flex items-center justify-center hover:bg-[#FF6500]/20 transition-all"
                title="Scan IDCard"
              >
                <div className="h-4 w-4 flex items-center justify-center">
                  <Globe className="h-4 w-4" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {!loading && (
          <MapContainer 
            center={[mapCenter.lat, mapCenter.lng]} 
            zoom={mapZoom} 
            className="w-full h-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <MapUpdater center={mapCenter} zoom={mapZoom} />
            
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={UserIcon}>
                <Popup>Your Location</Popup>
              </Marker>
            )}

            {filteredBooths.map((booth, index) => {
              const isSelected = selectedBooth?.id === booth.id || highlightedBoothId === booth.id;
              return (
              <Marker 
                key={booth.id} 
                position={[booth.lat, booth.lng]} 
                icon={isSelected ? SelectedIcon : createCrowdIcon(booth.crowdLevel)}
                eventHandlers={{
                  click: () => {
                    speakText(`Selected booth ${booth.name}, located ${booth.distance} away. Crowd level is ${booth.crowdLevel}. Accessibility features: ${booth.accessibilityFeatures.length > 0 ? booth.accessibilityFeatures.join(', ') : 'None listed'}.`);
                    if (selectedBooth && selectedBooth.id !== booth.id) {
                      setSelectedBooth(null);
                    }
                    setHighlightedBoothId(booth.id);
                    setMapCenter({ lat: booth.lat, lng: booth.lng });
                    setMapZoom(16);
                  },
                  mouseover: () => {
                    speakText(`Map Marker: ${booth.name}, located ${booth.distance} away. Address: ${booth.address}. Crowd level is ${booth.crowdLevel}.`);
                  }
                }}
              >
                <Popup className="rounded-xl">
                  <div className="p-1">
                    <h5 className="font-bold text-slate-800 mb-1">{booth.name}</h5>
                    <p className="text-xs text-slate-500 mb-2">{booth.address}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={cn(
                        "px-2 py-1 rounded-md font-bold uppercase tracking-wider text-[9px]",
                        booth.crowdLevel === 'Low' ? "bg-emerald-100 text-emerald-700" : 
                        booth.crowdLevel === 'Medium' ? "bg-amber-100 text-amber-700" : 
                        "bg-red-100 text-red-700"
                      )}>{booth.crowdLevel} Crowd</span>
                      <span className="font-bold text-slate-600">{booth.distance}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )})}
          </MapContainer>
        )}
        

        <div className="absolute bottom-6 right-6 flex flex-col gap-2 pointer-events-none md:pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 hidden md:block">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Map Legend</h5>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#00796B]" />
                <span className="text-[10px] font-bold text-slate-600">Low Crowd (Fast)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#FF6500]" />
                <span className="text-[10px] font-bold text-slate-600">Medium Crowd</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-[10px] font-bold text-slate-600">High Crowd (Wait)</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <div className="h-3 w-3 rounded-full bg-[#0B0F2E]" />
                <span className="text-[10px] font-bold text-slate-600">Your Location</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

