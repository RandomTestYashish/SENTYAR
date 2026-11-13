import { Suspense, lazy, useEffect, useState } from "react";
import { HashRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { StoreProvider, useApp } from "./store";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CartDrawer } from "../components/CartDrawer";
import { Announcer, Notice, Toasts } from "../components/ui";
import { Tour, Welcome } from "../features/tour/Tour";
import Home from "../pages/Home";

const Kits = lazy(() => import("../pages/Kits"));
const KitDetail = lazy(() => import("../pages/KitDetail"));
const Unboxing = lazy(() => import("../pages/Unboxing"));
const Lab = lazy(() => import("../pages/Lab"));
const Preview = lazy(() => import("../pages/Preview"));
const NatureLab = lazy(() => import("../pages/NatureLab"));
const Ingredients = lazy(() => import("../pages/Ingredients"));
const IngredientJourney = lazy(() => import("../pages/IngredientJourney"));
const Creations = lazy(() => import("../pages/Creations"));
const CreationDetail = lazy(() => import("../pages/CreationDetail"));
const Marketplace = lazy(() => import("../pages/Marketplace"));
const HowItWorks = lazy(() => import("../pages/HowItWorks"));
const Brand = lazy(() => import("../pages/Brand"));
const Prefer = lazy(() => import("../pages/Prefer"));
const Discover = lazy(() => import("../pages/Discover"));
const FragrancePage = lazy(() => import("../pages/FragrancePage"));
const FamilyPage = lazy(() => import("../pages/FamilyPage"));
const KitPage = lazy(() => import("../pages/KitPage"));
const Studio = lazy(() => import("../pages/Studio"));
const Recipes = lazy(() => import("../pages/Recipes"));
const RecipePage = lazy(() => import("../pages/RecipePage"));
const GuidedMaking = lazy(() => import("../pages/GuidedMaking"));
const Learn = lazy(() => import("../pages/Learn"));
const LearnEntry = lazy(() => import("../pages/LearnEntry"));
const About = lazy(() => import("../pages/About"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const main = document.getElementById("main");
    main?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}

function StorageBanner() {
  const { storageOk, recovered, saveFailed } = useApp();
  const [hidden, setHidden] = useState(false);
  if (hidden || (storageOk && !recovered && !saveFailed)) return null;
  return (
    <div className="container" style={{ paddingTop: 16 }}>
      <Notice tone="warn">
        {!storageOk || saveFailed ? (
          <><strong>Saving is unavailable in this browser.</strong> Private browsing or blocked site data prevents local saving. You can still explore and compose; creations and your cart will be lost when you close this tab.</>
        ) : (
          <><strong>Some saved data could not be read and was reset.</strong> This can happen after clearing site data or with data from an older version. Everything still works.</>
        )}{" "}
        <button className="link" onClick={() => setHidden(true)}>Dismiss</button>
      </Notice>
    </div>
  );
}

function Loading() {
  return (
    <div className="container section" aria-busy="true" aria-live="polite">
      <div className="skeleton" style={{ height: 32, width: 240, marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 320 }} />
      <span className="sr-only">Loading page…</span>
    </div>
  );
}

function NotFound() {
  return (
    <div className="container section empty">
      <p className="eyebrow">404</p>
      <h1 className="h2">This page isn’t part of the studio</h1>
      <p>The link may be outdated. Head back to the beginning or straight into the lab.</p>
      <div className="row" style={{ justifyContent: "center" }}>
        <Link to="/" className="btn">Go home</Link>
        <Link to="/lab" className="btn btn--secondary">Enter the Lab</Link>
      </div>
    </div>
  );
}

function Shell() {
  const loc = useLocation();
  return (
    <>
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>Skip to content</a>
      <Header />
      <StorageBanner />
      <main id="main" tabIndex={-1} key={loc.pathname} className="page-enter">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kits" element={<Kits />} />
            <Route path="/kits/creator-kit-v1" element={<KitDetail />} />
            <Route path="/kits/:id" element={<KitPage />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/fragrances/:id" element={<FragrancePage />} />
            <Route path="/families/:id" element={<FamilyPage />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/studio/recipes" element={<Recipes />} />
            <Route path="/studio/recipes/:id" element={<RecipePage />} />
            <Route path="/studio/guide/:id" element={<GuidedMaking />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:id" element={<LearnEntry />} />
            <Route path="/about" element={<About />} />
            <Route path="/kits/creator-kit-v1/unbox" element={<Unboxing />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/lab/preview" element={<Preview />} />
            <Route path="/nature-lab" element={<NatureLab />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/ingredients/:id" element={<IngredientJourney />} />
            <Route path="/creations" element={<Creations />} />
            <Route path="/creations/:id" element={<CreationDetail />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/brand" element={<Brand />} />
            <Route path="/prefer" element={<Prefer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <Tour />
      <Welcome />
      <Toasts />
      <Announcer />
      <ScrollToTop />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </StoreProvider>
  );
}
