"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Star,
  ShieldCheck,
  Linkedin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Types & Data ---
type Expert = {
  id: string | number;
  name: string;
  role: string;
  company: string;
  companyLogo: string;
  avatarInitial: string;
  rating: number;
  reviews: number;
  expertise: string[];
  price: number;
  availability: string;
  domain: string;
  experience: string;
  verified: boolean;
  linkedinUrl: string;
};

type MentorsResponse = {
  mentors: Expert[];
  stats: {
    totalMentors: number;
    avgHourlyRate: number;
    activeSessions: number;
    satisfaction: string;
  };
};

const allExperts: Expert[] = [
  {
    id: 1,
    name: "Aditi Sharma",
    role: "Director of Engineering",
    company: "Google",
    companyLogo: "",
    avatarInitial: "AS",
    rating: 4.9,
    reviews: 128,
    expertise: ["System Design", "Scalability"],
    price: 5000,
    availability: "Tomorrow",
    domain: "Software",
    experience: "12 Yrs",
    verified: true,
    linkedinUrl: "https://www.linkedin.com/in/aditi-sharma",
  },
  {
    id: 2,
    name: "Rohan Mehta",
    role: "Principal PM",
    company: "Microsoft",
    companyLogo: "",
    avatarInitial: "RM",
    rating: 4.8,
    reviews: 94,
    expertise: ["Product Strategy", "B2B SaaS"],
    price: 4200,
    availability: "Tue, 12 Dec",
    domain: "Product",
    experience: "9 Yrs",
    verified: true,
    linkedinUrl: "https://www.linkedin.com/in/rohan-mehta",
  },
  {
    id: 3,
    name: "Sameer Khan",
    role: "Lead Data Scientist",
    company: "Amazon",
    companyLogo: "",
    avatarInitial: "SK",
    rating: 5.0,
    reviews: 210,
    expertise: ["AI/ML", "Python"],
    price: 3500,
    availability: "Available Now",
    domain: "Data Science",
    experience: "8 Yrs",
    verified: true,
    linkedinUrl: "https://www.linkedin.com/in/sameer-khan",
  },
  {
    id: 4,
    name: "Priya Singh",
    role: "Senior UX Designer",
    company: "Cred",
    companyLogo: "",
    avatarInitial: "PS",
    rating: 4.9,
    reviews: 180,
    expertise: ["Design Systems", "Figma"],
    price: 2800,
    availability: "Wed, 13 Dec",
    domain: "Design",
    experience: "7 Yrs",
    verified: false,
    linkedinUrl: "https://www.linkedin.com/in/priya-singh",
  },
  {
    id: 5,
    name: "Vikram Kumar",
    role: "Staff Engineer",
    company: "Zerodha",
    companyLogo: "",
    avatarInitial: "VK",
    rating: 4.9,
    reviews: 150,
    expertise: ["Backend", "Golang"],
    price: 3000,
    availability: "Thu, 14 Dec",
    domain: "Software",
    experience: "10 Yrs",
    verified: true,
    linkedinUrl: "https://www.linkedin.com/in/vikram-kumar",
  },
  {
    id: 6,
    name: "Ananya Gupta",
    role: "Marketing Head",
    company: "Zomato",
    companyLogo: "",
    avatarInitial: "AG",
    rating: 4.7,
    reviews: 85,
    expertise: ["Growth", "Brand"],
    price: 2500,
    availability: "Fri, 15 Dec",
    domain: "Marketing",
    experience: "6 Yrs",
    verified: false,
    linkedinUrl: "https://www.linkedin.com/in/ananya-gupta",
  },
];

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950">
    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{label}</p>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {value}
      </span>
    </div>
  </div>
);

export default function StudentMentorsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [experts, setExperts] = useState<Expert[]>(allExperts); // Initialize with mock data

  const [stats, setStats] = useState({
    totalMentors: 124,
    avgHourlyRate: 3200,
    activeSessions: 3,
    satisfaction: "4.9",
  });
  
  const [loading, setLoading] = useState(false); // Set false initially to show mock data
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    // If no API URL is provided, we just stick with allExperts (default state)
    if (!apiBase) return;

    const fetchMentors = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/mentors`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = (await res.json()) as MentorsResponse;
        if (data.mentors && data.mentors.length > 0) {
          setExperts(data.mentors);
          setStats(data.stats);
        }
      } catch (err) {
        console.warn("API unavailable, using fallback mock data.");
        // We keep experts as allExperts if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [apiBase]);

  const filteredExperts = useMemo(() => {
    return experts.filter((expert) => {
      const matchesSearch =
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.company.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDomain =
        selectedDomain === "All" || expert.domain === selectedDomain;

      return matchesSearch && matchesDomain;
    });
  }, [searchQuery, selectedDomain, experts]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Mentorship</h1>
        <p className="text-sm text-zinc-500">
          Connect with industry experts for guidance and career advice.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Mentors" value={loading ? "..." : stats.totalMentors.toString()} />
        <StatCard label="Avg. Hourly Rate" value={loading ? "..." : `₹${stats.avgHourlyRate.toLocaleString("en-IN")}`} />
        <StatCard label="Active Sessions" value={loading ? "..." : stats.activeSessions.toString()} />
        <StatCard label="Satisfaction" value={loading ? "..." : `${stats.satisfaction}/5.0`} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by name, company..."
            className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 border-zinc-200 dark:border-zinc-800 gap-2">
                <Filter size={14} />
                {selectedDomain}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedDomain("All")}>All Domains</DropdownMenuItem>
              {["Software", "Product", "Data Science", "Design", "Marketing"].map((d) => (
                <DropdownMenuItem key={d} onClick={() => setSelectedDomain(d)}>{d}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-9 border border-zinc-200 dark:border-zinc-800 rounded-md flex p-0.5 bg-white dark:bg-zinc-900">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-2.5 rounded-sm ${viewMode === "grid" ? "bg-zinc-100 dark:bg-zinc-800" : "text-zinc-400"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-2.5 rounded-sm ${viewMode === "list" ? "bg-zinc-100 dark:bg-zinc-800" : "text-zinc-400"}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
        </div>
      ) : filteredExperts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No mentors found</p>
          <p className="text-xs text-zinc-500">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"}>
          {filteredExperts.map((expert) => (
            <div key={expert.id} className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col`}>
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12 rounded-lg">
                  <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800">{expert.avatarInitial}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold">{expert.name}</h3>
                    {expert.verified && <ShieldCheck size={14} className="text-blue-500" />}
                  </div>
                  <p className="text-sm text-zinc-500">{expert.role} @ {expert.company}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {expert.expertise.map((s) => (
                  <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t dark:border-zinc-800 mt-auto">
                <div className="font-semibold">₹{expert.price.toLocaleString("en-IN")}</div>
                <Button size="sm" onClick={() => setSelectedExpert(expert)}>Book Now</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog open={!!selectedExpert} onOpenChange={() => setSelectedExpert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {selectedExpert?.name}</DialogTitle>
            <DialogDescription>Confirm your booking details below.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedExpert(null)}>Cancel</Button>
            <Button onClick={() => router.push(`/dashboard/student/booking/slot-selection?mentorId=${selectedExpert?.id}`)}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}