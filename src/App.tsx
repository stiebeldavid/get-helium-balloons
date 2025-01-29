import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import CityPage from "./pages/CityPage";
import EventPage from "./pages/EventPage";
import CityEventPage from "./pages/CityEventPage";
import BlogPost from "./pages/BlogPost";
import BlogIndex from "./pages/BlogIndex";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Helmet titleTemplate="%s | Balloon Finder" defaultTitle="Find Helium Balloons Near You | Balloon Finder">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Balloon Finder" />
      </Helmet>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/:zipCode" element={<SearchResults />} />
          <Route path="/city/:citySlug" element={<CityPage />} />
          <Route path="/events/:eventType" element={<EventPage />} />
          <Route path="/events/:eventType/:citySlug" element={<CityEventPage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;