import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChefHat,
  Flower2,
  Heart,
  Mail,
  MapPin,
  Menu,
  Phone,
  Star,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import {
  CateringCategory,
  Gender,
  InquirySubject,
  PriceRange,
} from "./backend";
import type {
  CateringService,
  ContactInquiry,
  MatrimonyProfile,
} from "./backend";
import {
  sampleCateringServices,
  sampleMatrimonyProfiles,
} from "./data/sampleData";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useAddCateringService,
  useAddMatrimonyProfile,
  useDeleteCateringService,
  useDeleteMatrimonyProfile,
  useGetCateringServices,
  useGetContactInquiries,
  useGetMatrimonyProfiles,
  useIsAdmin,
  useSubmitContactInquiry,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [communityFilter, setCommunityFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: InquirySubject.general,
    message: "",
  });

  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const qc = useQueryClient();
  const isAuthenticated = !!identity;

  const { data: isAdmin } = useIsAdmin();
  const { data: backendCatering } = useGetCateringServices();
  const { data: backendMatrimony } = useGetMatrimonyProfiles(
    communityFilter || undefined,
    locationFilter || undefined,
    genderFilter ? (genderFilter as Gender) : undefined,
  );
  const { data: contactInquiries } = useGetContactInquiries();
  const submitInquiry = useSubmitContactInquiry();
  const addCatering = useAddCateringService();
  const deleteCatering = useDeleteCateringService();
  const addMatrimony = useAddMatrimonyProfile();
  const deleteMatrimony = useDeleteMatrimonyProfile();

  const cateringServices =
    backendCatering && backendCatering.length > 0
      ? backendCatering.map((s, i) => ({ ...s, id: i + 1 }))
      : sampleCateringServices;

  const matrimonyProfiles =
    backendMatrimony && backendMatrimony.length > 0
      ? backendMatrimony.map((p, i) => ({ ...p, id: i + 1 }))
      : sampleMatrimonyProfiles.filter((p) => {
          if (genderFilter && p.gender !== genderFilter) return false;
          if (communityFilter && p.community !== communityFilter) return false;
          if (
            locationFilter &&
            !p.location.toLowerCase().includes(locationFilter.toLowerCase())
          )
            return false;
          return true;
        });

  const cateringRef = useRef<HTMLElement>(null);
  const matrimonyRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleLogin = async () => {
    if (isAuthenticated) {
      await clear();
      qc.clear();
      setAdminPanelOpen(false);
    } else {
      try {
        await login();
      } catch (e: any) {
        if (e?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inquiry: ContactInquiry = {
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      subject: contactForm.subject,
      message: contactForm.message,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    };
    try {
      await submitInquiry.mutateAsync(inquiry);
      toast.success("Your inquiry has been submitted! We'll contact you soon.");
      setContactForm({
        name: "",
        email: "",
        phone: "",
        subject: InquirySubject.general,
        message: "",
      });
    } catch {
      toast.error("Failed to submit inquiry. Please try again.");
    }
  };

  const priceLabel = (p: PriceRange) => {
    if (p === PriceRange.budget) return "Budget Friendly";
    if (p === PriceRange.standard) return "Standard";
    return "Premium";
  };

  const categoryLabel = (c: CateringCategory) => {
    if (c === CateringCategory.wedding) return "Wedding";
    if (c === CateringCategory.festival) return "Festival";
    if (c === CateringCategory.birthday) return "Birthday";
    return "Corporate";
  };

  const genderLabel = (g: Gender) => {
    if (g === Gender.male) return "Male";
    if (g === Gender.female) return "Female";
    return "Other";
  };

  return (
    <div className="min-h-screen bg-cream font-sans">
      {/* Top utility bar */}
      <div className="bg-maroon text-white text-xs py-2 text-center font-sans tracking-wide">
        Vazhalai | Tamil Cultural Catering & Matrimony — Serving with Love &
        Tradition
      </div>

      {/* Header */}
      <header className="bg-cream-light sticky top-0 z-50 shadow-warm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-maroon rounded-full flex items-center justify-center">
              <Flower2 className="w-6 h-6 text-mustard" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-brown leading-none">
                Vazhalai
              </h1>
              <p className="text-[10px] text-brown-muted leading-none font-sans">
                Tamil Cultural Services
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-8"
            data-ocid="main.nav"
          >
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-brown hover:text-maroon transition-colors font-sans text-sm font-medium"
              data-ocid="nav.home.link"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollTo(cateringRef)}
              className="text-brown hover:text-maroon transition-colors font-sans text-sm font-medium"
              data-ocid="nav.catering.link"
            >
              Catering Services
            </button>
            <button
              type="button"
              onClick={() => scrollTo(matrimonyRef)}
              className="text-brown hover:text-maroon transition-colors font-sans text-sm font-medium"
              data-ocid="nav.matrimony.link"
            >
              Matrimony
            </button>
            <button
              type="button"
              onClick={() => scrollTo(contactRef)}
              className="text-brown hover:text-maroon transition-colors font-sans text-sm font-medium"
              data-ocid="nav.contact.link"
            >
              Contact Us
            </button>
          </nav>

          {/* Sign In CTA */}
          <div className="flex items-center gap-3">
            <Button
              onClick={
                isAuthenticated ? () => setAdminPanelOpen(true) : handleLogin
              }
              disabled={loginStatus === "logging-in"}
              className="bg-maroon hover:bg-maroon-dark text-white font-sans text-sm hidden md:flex"
              data-ocid="header.signin.button"
            >
              {loginStatus === "logging-in"
                ? "Signing In..."
                : isAuthenticated
                  ? "Admin Panel"
                  : "Sign In"}
            </Button>
            {isAuthenticated && (
              <Button
                variant="outline"
                onClick={handleLogin}
                className="text-brown-muted border-border hidden md:flex text-sm"
                data-ocid="header.logout.button"
              >
                Logout
              </Button>
            )}
            <button
              type="button"
              className="md:hidden text-brown"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-ocid="nav.mobile.toggle"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-cream-light border-t border-border overflow-hidden"
              data-ocid="nav.mobile.menu"
            >
              <div className="flex flex-col px-4 py-4 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setMobileMenuOpen(false);
                  }}
                  className="text-brown text-sm font-medium text-left"
                  data-ocid="nav.mobile.home.link"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo(cateringRef)}
                  className="text-brown text-sm font-medium text-left"
                  data-ocid="nav.mobile.catering.link"
                >
                  Catering Services
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo(matrimonyRef)}
                  className="text-brown text-sm font-medium text-left"
                  data-ocid="nav.mobile.matrimony.link"
                >
                  Matrimony
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo(contactRef)}
                  className="text-brown text-sm font-medium text-left"
                  data-ocid="nav.mobile.contact.link"
                >
                  Contact Us
                </button>
                <Button
                  onClick={
                    isAuthenticated
                      ? () => {
                          setAdminPanelOpen(true);
                          setMobileMenuOpen(false);
                        }
                      : handleLogin
                  }
                  className="bg-maroon text-white w-full"
                  data-ocid="nav.mobile.signin.button"
                >
                  {isAuthenticated ? "Admin Panel" : "Sign In"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "85vh" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-vazhalai.dim_1400x700.jpg')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(59,36,24,0.88) 0%, rgba(59,36,24,0.65) 50%, rgba(59,36,24,0.3) 100%)",
          }}
        />
        <div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center"
          style={{ minHeight: "85vh" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-mustard" />
              <span className="text-mustard text-sm font-sans font-medium tracking-widest uppercase">
                Tamil Cultural Excellence
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-4">
              Celebrate Life's
              <span className="block text-mustard">Grand Moments</span>
            </h2>
            <p className="text-cream text-lg font-sans leading-relaxed mb-8 opacity-90">
              Authentic Tamil catering for every occasion & a trusted matrimony
              platform to find your perfect life partner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => scrollTo(cateringRef)}
                className="bg-terracotta hover:bg-terracotta-dark text-white font-sans font-semibold px-8 py-6 text-base"
                data-ocid="hero.catering.button"
              >
                <ChefHat className="w-5 h-5 mr-2" />
                Explore Catering
              </Button>
              <Button
                onClick={() => scrollTo(matrimonyRef)}
                className="bg-mustard hover:bg-mustard-dark text-brown font-sans font-semibold px-8 py-6 text-base"
                data-ocid="hero.matrimony.button"
              >
                <Heart className="w-5 h-5 mr-2" />
                Find Your Partner
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { label: "Happy Families", value: "500+" },
                { label: "Events Catered", value: "1200+" },
                { label: "Profiles Listed", value: "300+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-serif font-bold text-mustard">
                    {stat.value}
                  </div>
                  <div className="text-cream text-xs font-sans opacity-80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Catering Section */}
      <section ref={cateringRef} className="py-20 bg-cream" id="catering">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <ChefHat className="w-7 h-7 text-terracotta" />
              <span className="text-terracotta font-sans text-sm font-semibold tracking-widest uppercase">
                Our Services
              </span>
              <ChefHat className="w-7 h-7 text-terracotta" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-brown mb-3">
              Catering Services
            </h2>
            <p className="text-brown-muted font-sans max-w-xl mx-auto">
              Authentic Tamil cuisine crafted with love for weddings, festivals,
              and every celebration worth cherishing.
            </p>
            <div className="w-16 h-0.5 bg-mustard mx-auto mt-4" />
          </motion.div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            data-ocid="catering.list"
          >
            {cateringServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-shadow border border-border group"
                data-ocid={`catering.item.${idx + 1}`}
              >
                <div className="relative overflow-hidden h-52">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-maroon text-white text-xs font-sans">
                      {categoryLabel(service.category)}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant="secondary"
                      className="bg-mustard/90 text-brown text-xs font-sans"
                    >
                      {priceLabel(service.priceRange)}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-serif font-semibold text-brown mb-2">
                    {service.name}
                  </h3>
                  <p className="text-brown-muted text-sm font-sans leading-relaxed mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-brown-muted text-xs mb-4">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="font-sans">{service.phone}</span>
                  </div>
                  <Button
                    className="w-full bg-maroon hover:bg-maroon-dark text-white font-sans"
                    data-ocid={`catering.menu.button.${idx + 1}`}
                  >
                    View Menu
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Matrimony Section */}
      <section
        ref={matrimonyRef}
        className="py-20 bg-cream-dark"
        id="matrimony"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Heart className="w-7 h-7 text-maroon" />
              <span className="text-maroon font-sans text-sm font-semibold tracking-widest uppercase">
                Find Your Match
              </span>
              <Heart className="w-7 h-7 text-maroon" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-brown mb-3">
              Tamil Matrimony
            </h2>
            <p className="text-brown-muted font-sans max-w-xl mx-auto">
              Connect with compatible Tamil families seeking life partners
              rooted in culture, values, and tradition.
            </p>
            <div className="w-16 h-0.5 bg-mustard mx-auto mt-4" />
          </motion.div>

          {/* Filters */}
          <div
            className="flex flex-wrap gap-4 justify-center mb-10 p-5 bg-white rounded-xl shadow-warm border border-border"
            data-ocid="matrimony.filters.panel"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-maroon" />
              <span className="text-sm font-sans font-medium text-brown">
                Filter:
              </span>
            </div>
            <Select value={communityFilter} onValueChange={setCommunityFilter}>
              <SelectTrigger
                className="w-44 font-sans text-sm"
                data-ocid="matrimony.community.select"
              >
                <SelectValue placeholder="Community" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Communities</SelectItem>
                <SelectItem value="Brahmin">Brahmin</SelectItem>
                <SelectItem value="Mudaliar">Mudaliar</SelectItem>
                <SelectItem value="Nadar">Nadar</SelectItem>
                <SelectItem value="Pillai">Pillai</SelectItem>
                <SelectItem value="Gounder">Gounder</SelectItem>
                <SelectItem value="Chettiar">Chettiar</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger
                className="w-44 font-sans text-sm"
                data-ocid="matrimony.location.select"
              >
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Coimbatore">Coimbatore</SelectItem>
                <SelectItem value="Madurai">Madurai</SelectItem>
                <SelectItem value="Trichy">Trichy</SelectItem>
                <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                <SelectItem value="Dubai">Dubai</SelectItem>
                <SelectItem value="Singapore">Singapore</SelectItem>
              </SelectContent>
            </Select>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger
                className="w-36 font-sans text-sm"
                data-ocid="matrimony.gender.select"
              >
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Genders</SelectItem>
                <SelectItem value={Gender.male}>Male</SelectItem>
                <SelectItem value={Gender.female}>Female</SelectItem>
              </SelectContent>
            </Select>
            {(communityFilter || locationFilter || genderFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setCommunityFilter("");
                  setLocationFilter("");
                  setGenderFilter("");
                }}
                className="text-sm font-sans border-maroon text-maroon"
                data-ocid="matrimony.clear.button"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {matrimonyProfiles.length === 0 ? (
            <div
              className="text-center py-20 text-brown-muted"
              data-ocid="matrimony.empty_state"
            >
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-sans text-lg">
                No profiles match your filters.
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              data-ocid="matrimony.list"
            >
              {matrimonyProfiles.map((profile, idx) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-white rounded-xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-shadow border border-border group"
                  data-ocid={`matrimony.item.${idx + 1}`}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={profile.imageUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brown/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-serif font-semibold text-lg leading-tight">
                        {profile.name}
                      </p>
                      <p className="text-cream text-xs font-sans">
                        {Number(profile.age)} yrs •{" "}
                        {genderLabel(profile.gender)}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-brown-muted text-xs mb-1">
                      <MapPin className="w-3 h-3" />
                      <span className="font-sans truncate">
                        {profile.location}
                      </span>
                    </div>
                    <div className="text-xs text-brown-muted font-sans mb-1 truncate">
                      {profile.education}
                    </div>
                    <div className="text-xs text-maroon font-sans font-medium mb-1">
                      {profile.profession}
                    </div>
                    <Badge className="text-[10px] bg-cream text-brown-muted border border-border mb-3 font-sans">
                      {profile.community}
                    </Badge>
                    <Button
                      className="w-full bg-maroon hover:bg-maroon-dark text-white text-sm font-sans py-2"
                      data-ocid={`matrimony.profile.button.${idx + 1}`}
                    >
                      View Profile
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-20 bg-cream" id="contact">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Mail className="w-7 h-7 text-mustard" />
              <span className="text-mustard font-sans text-sm font-semibold tracking-widest uppercase">
                Get In Touch
              </span>
              <Mail className="w-7 h-7 text-mustard" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-brown mb-3">
              Contact Us
            </h2>
            <p className="text-brown-muted font-sans">
              Have a query about our services? We'd love to hear from you.
            </p>
            <div className="w-16 h-0.5 bg-mustard mx-auto mt-4" />
          </motion.div>

          <div
            className="bg-white rounded-2xl shadow-warm-lg p-8 border border-border"
            data-ocid="contact.form.panel"
          >
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label className="text-brown font-sans text-sm font-medium mb-1.5 block">
                    Full Name *
                  </Label>
                  <Input
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Your full name"
                    className="font-sans border-border"
                    data-ocid="contact.name.input"
                  />
                </div>
                <div>
                  <Label className="text-brown font-sans text-sm font-medium mb-1.5 block">
                    Email *
                  </Label>
                  <Input
                    required
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="your@email.com"
                    className="font-sans border-border"
                    data-ocid="contact.email.input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label className="text-brown font-sans text-sm font-medium mb-1.5 block">
                    Phone
                  </Label>
                  <Input
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="+91 98765 43210"
                    className="font-sans border-border"
                    data-ocid="contact.phone.input"
                  />
                </div>
                <div>
                  <Label className="text-brown font-sans text-sm font-medium mb-1.5 block">
                    Subject *
                  </Label>
                  <Select
                    value={contactForm.subject}
                    onValueChange={(v) =>
                      setContactForm((p) => ({
                        ...p,
                        subject: v as InquirySubject,
                      }))
                    }
                  >
                    <SelectTrigger
                      className="font-sans"
                      data-ocid="contact.subject.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={InquirySubject.general}>
                        General Inquiry
                      </SelectItem>
                      <SelectItem value={InquirySubject.catering}>
                        Catering Services
                      </SelectItem>
                      <SelectItem value={InquirySubject.matrimony}>
                        Matrimony
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-brown font-sans text-sm font-medium mb-1.5 block">
                  Message *
                </Label>
                <Textarea
                  required
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="Tell us how we can help you..."
                  rows={4}
                  className="font-sans border-border resize-none"
                  data-ocid="contact.message.textarea"
                />
              </div>
              <Button
                type="submit"
                disabled={submitInquiry.isPending}
                className="w-full bg-maroon hover:bg-maroon-dark text-white font-sans font-semibold py-6 text-base"
                data-ocid="contact.submit.button"
              >
                {submitInquiry.isPending ? "Sending..." : "Send Message"}
              </Button>
              {submitInquiry.isSuccess && (
                <p
                  className="text-center text-sm text-green-600 font-sans"
                  data-ocid="contact.success_state"
                >
                  ✓ Message sent successfully!
                </p>
              )}
              {submitInquiry.isError && (
                <p
                  className="text-center text-sm text-destructive font-sans"
                  data-ocid="contact.error_state"
                >
                  Failed to send. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-maroon text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-mustard rounded-full flex items-center justify-center">
                  <Flower2 className="w-6 h-6 text-maroon" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    Vazhalai
                  </h3>
                  <p className="text-cream-dark text-xs font-sans opacity-70">
                    Tamil Cultural Services
                  </p>
                </div>
              </div>
              <p className="text-cream-dark opacity-70 text-sm font-sans leading-relaxed">
                Bridging hearts and celebrations through the rich traditions of
                Tamil culture.
              </p>
              <div className="flex gap-4 mt-5">
                <button
                  type="button"
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-mustard transition-colors"
                  aria-label="Facebook"
                >
                  <SiFacebook className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-mustard transition-colors"
                  aria-label="Instagram"
                >
                  <SiInstagram className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-mustard transition-colors"
                  aria-label="WhatsApp"
                >
                  <SiWhatsapp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-serif font-semibold text-mustard mb-4 text-lg">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  {
                    label: "Catering Services",
                    action: () => scrollTo(cateringRef),
                  },
                  {
                    label: "Matrimony Profiles",
                    action: () => scrollTo(matrimonyRef),
                  },
                  { label: "Contact Us", action: () => scrollTo(contactRef) },
                ].map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={link.action}
                      className="text-cream-dark opacity-70 hover:opacity-100 hover:text-mustard text-sm font-sans transition-all text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-serif font-semibold text-mustard mb-4 text-lg">
                Stay Updated
              </h4>
              <p className="text-cream-dark opacity-70 text-sm font-sans mb-4">
                Get the latest catering menus and matrimony profiles in your
                inbox.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 font-sans text-sm"
                  data-ocid="footer.newsletter.input"
                />
                <Button
                  className="bg-mustard hover:bg-mustard-dark text-brown font-sans text-sm shrink-0"
                  data-ocid="footer.newsletter.button"
                >
                  Subscribe
                </Button>
              </div>
              <div className="mt-6 flex items-start gap-2 text-sm text-cream-dark opacity-70 font-sans">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Chennai, Tamil Nadu, India</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-4">
          <p className="text-center text-xs text-white/50 font-sans">
            © {new Date().getFullYear()} Vazhalai. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="hover:text-mustard transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Admin Panel Dialog */}
      <Dialog open={adminPanelOpen} onOpenChange={setAdminPanelOpen}>
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-brown">
              {isAdmin ? "Admin Panel" : "Access Restricted"}
            </DialogTitle>
          </DialogHeader>
          {!isAdmin ? (
            <div className="py-8 text-center" data-ocid="admin.error_state">
              <p className="text-brown-muted font-sans">
                You do not have admin privileges to access this panel.
              </p>
            </div>
          ) : (
            <AdminPanel
              contactInquiries={contactInquiries || []}
              onAddCatering={addCatering.mutateAsync}
              onDeleteCatering={deleteCatering.mutateAsync}
              onAddMatrimony={addMatrimony.mutateAsync}
              onDeleteMatrimony={deleteMatrimony.mutateAsync}
              cateringServices={cateringServices}
              matrimonyProfiles={matrimonyProfiles}
            />
          )}
        </DialogContent>
      </Dialog>

      <Toaster richColors />
    </div>
  );
}

interface AdminPanelProps {
  contactInquiries: ContactInquiry[];
  onAddCatering: (s: CateringService) => Promise<bigint>;
  onDeleteCatering: (id: bigint) => Promise<void>;
  onAddMatrimony: (p: MatrimonyProfile) => Promise<bigint>;
  onDeleteMatrimony: (id: bigint) => Promise<void>;
  cateringServices: (CateringService & { id: number })[];
  matrimonyProfiles: (MatrimonyProfile & { id: number })[];
}

function AdminPanel({
  contactInquiries,
  cateringServices,
  matrimonyProfiles,
  onDeleteCatering,
  onDeleteMatrimony,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "catering" | "matrimony" | "inquiries"
  >("catering");

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-border pb-4">
        {(["catering", "matrimony", "inquiries"] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab ? "bg-maroon text-white" : "text-brown"
            }
            data-ocid={`admin.${tab}.tab`}
          >
            {tab === "catering"
              ? "Catering"
              : tab === "matrimony"
                ? "Matrimony"
                : "Inquiries"}
          </Button>
        ))}
      </div>

      {activeTab === "catering" && (
        <div>
          <h3 className="font-serif text-xl text-brown mb-4">
            Catering Services ({cateringServices.length})
          </h3>
          <div className="space-y-3" data-ocid="admin.catering.list">
            {cateringServices.map((s, idx) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 bg-cream rounded-lg border border-border"
                data-ocid={`admin.catering.item.${idx + 1}`}
              >
                <div>
                  <p className="font-sans font-medium text-brown text-sm">
                    {s.name}
                  </p>
                  <p className="text-xs text-brown-muted font-sans">
                    {s.category} • {s.priceRange}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteCatering(BigInt(s.id))}
                  className="text-xs"
                  data-ocid={`admin.catering.delete_button.${idx + 1}`}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "matrimony" && (
        <div>
          <h3 className="font-serif text-xl text-brown mb-4">
            Matrimony Profiles ({matrimonyProfiles.length})
          </h3>
          <div className="space-y-3" data-ocid="admin.matrimony.list">
            {matrimonyProfiles.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 bg-cream rounded-lg border border-border"
                data-ocid={`admin.matrimony.item.${idx + 1}`}
              >
                <div>
                  <p className="font-sans font-medium text-brown text-sm">
                    {p.name}
                  </p>
                  <p className="text-xs text-brown-muted font-sans">
                    {p.community} • {p.location} • {Number(p.age)} yrs
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteMatrimony(BigInt(p.id))}
                  className="text-xs"
                  data-ocid={`admin.matrimony.delete_button.${idx + 1}`}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "inquiries" && (
        <div>
          <h3 className="font-serif text-xl text-brown mb-4">
            Contact Inquiries ({contactInquiries.length})
          </h3>
          {contactInquiries.length === 0 ? (
            <p
              className="text-brown-muted font-sans text-sm text-center py-8"
              data-ocid="admin.inquiries.empty_state"
            >
              No inquiries yet.
            </p>
          ) : (
            <div className="space-y-3" data-ocid="admin.inquiries.list">
              {contactInquiries.map((inq, idx) => (
                <div
                  key={inq.email + String(idx)}
                  className="p-4 bg-cream rounded-lg border border-border"
                  data-ocid={`admin.inquiries.item.${idx + 1}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-sans font-semibold text-brown text-sm">
                      {inq.name}
                    </p>
                    <Badge className="text-xs bg-maroon text-white">
                      {inq.subject}
                    </Badge>
                  </div>
                  <p className="text-xs text-brown-muted font-sans">
                    {inq.email} • {inq.phone}
                  </p>
                  <p className="text-sm text-brown font-sans mt-2">
                    {inq.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
