import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Wallet, 
  Hammer, 
  ShoppingBag, 
  User, 
  History, 
  Plus, 
  Zap, 
  TrendingUp, 
  ShieldCheck,
  Search,
  ArrowRightLeft
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { forgeArtifactMetadata } from "./services/geminiService";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: "wallet", icon: Wallet, label: "Carteira" },
    { id: "forge", icon: Hammer, label: "Forja" },
    { id: "market", icon: ShoppingBag, label: "Mercado" },
    { id: "profile", icon: User, label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-6 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            activeTab === tab.id ? "text-orange-500 scale-110" : "text-white/40 hover:text-white/60"
          )}
        >
          <tab.icon className="w-6 h-6" />
          <span className="text-[10px] font-medium uppercase tracking-widest">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div layoutId="nav-glow" className="absolute -top-1 w-8 h-1 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
          )}
        </button>
      ))}
    </nav>
  );
};

const Header = () => (
  <header className="fixed top-0 left-0 right-0 h-16 px-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-md z-40">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-orange-500 rounded-sm rotate-45 flex items-center justify-center">
        <div className="w-3 h-3 bg-white rotate-45" />
      </div>
      <h1 className="text-xl font-bold tracking-tighter text-white uppercase italic">LastroForge</h1>
    </div>
    <div className="flex items-center gap-4">
      <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs font-mono text-white/70">Mainnet L2</span>
      </div>
    </div>
  </header>
);

const ArtifactCard = ({ artifact }: { artifact: any; key?: any }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group cursor-pointer"
  >
    <div className="aspect-square bg-gradient-to-br from-neutral-800 to-neutral-950 p-6 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-24 h-24 border-2 border-white/20 rotate-45 flex items-center justify-center group-hover:rotate-90 transition-transform duration-700">
         <Zap className="text-orange-400 rotate-[-45deg] group-hover:rotate-[-90deg] transition-transform duration-700" size={32} />
      </div>
    </div>
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-white/40">{artifact.rarity || 'Artifact'}</span>
        <span className="text-[10px] font-mono text-orange-400">#{artifact.id.slice(-4)}</span>
      </div>
      <h3 className="font-medium text-white line-clamp-1">{artifact.name}</h3>
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
         <div className="flex items-center gap-1">
            <TrendingUp size={12} className="text-green-400" />
            <span className="text-xs font-mono text-white/70">{artifact.value} LF</span>
         </div>
         <div className="flex items-center gap-1">
            <History size={12} className="text-white/30" />
            <span className="text-[10px] text-white/30">{artifact.provenance?.length || 1} owners</span>
         </div>
      </div>
    </div>
  </motion.div>
);

// --- Sub-Views ---

const WalletView = ({ artifacts }: { artifacts: any[]; key?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="px-6 space-y-8"
  >
    <section className="pt-24">
      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Seu Patrimônio Digital</p>
      <div className="flex items-baseline gap-2">
        <h2 className="text-5xl font-bold tracking-tight text-white">42.85</h2>
        <span className="text-lg font-medium text-orange-500">LF</span>
      </div>
      <div className="mt-6 flex gap-3">
        <button className="flex-1 bg-white text-black font-bold h-12 rounded-xl flex items-center justify-center gap-2">
          <Plus size={18} /> MINT
        </button>
        <button className="flex-1 bg-white/10 hover:bg-white/15 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <ArrowRightLeft size={18} /> SWAP
        </button>
      </div>
    </section>

    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Seus Artefatos</h3>
        <span className="text-xs text-white/40">{artifacts.length} Colecionáveis</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {artifacts.map((art) => (
          <ArtifactCard key={art.id} artifact={art} />
        ))}
        {artifacts.length === 0 && (
           <div className="col-span-2 py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
             <p className="text-sm text-white/20 italic">Forja vazia. Comece a criar.</p>
           </div>
        )}
      </div>
    </section>
  </motion.div>
);

const ForgeView = ({ onMint }: { onMint: (art: any) => void; key?: string }) => {
  const [prompt, setPrompt] = useState("");
  const [isForging, setIsForging] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const handlePreview = async () => {
    if (!prompt) return;
    setIsForging(true);
    try {
      const data = await forgeArtifactMetadata(prompt);
      setPrediction(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsForging(false);
    }
  };

  const handleMint = async () => {
    if (!prediction) return;
    setIsForging(true);
    try {
       const res = await fetch("/api/artifacts/mint", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           ...prediction,
           owner: "User_Alpha"
         })
       });
       const newArt = await res.json();
       onMint(newArt);
       setPrediction(null);
       setPrompt("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsForging(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="px-6 pt-24 space-y-8 h-full flex flex-col pb-32"
    >
      <section className="flex-shrink-0">
        <h2 className="text-3xl font-bold text-white tracking-tight">Câmara de Forja</h2>
        <p className="text-sm text-white/60 mt-2">Combine sua vontade com a rede para transmutar dados em valor.</p>
      </section>

      <section className="flex-grow flex flex-col gap-6">
        <div className="relative">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isForging}
            placeholder="Descreva o conceito... (ex: Uma moeda de cristal que reage a movimentos do mercado global)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[160px] text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-all resize-none"
          />
          <button 
            onClick={handlePreview}
            disabled={!prompt || isForging}
            className="absolute bottom-4 right-4 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white disabled:bg-white/10"
          >
            {isForging ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <Plus />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {prediction && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/10 border border-white/20 rounded-2xl p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-orange-500 font-bold uppercase tracking-widest text-[10px]">Previsão Oracle</h4>
                <ShieldCheck className="text-green-500" size={16} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{prediction.name}</h3>
                <p className="text-sm text-white/70 mt-2 leading-relaxed italic">"{prediction.description}"</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-black/40 rounded-xl">
                  <span className="text-[10px] uppercase text-white/40 block">Mercado Alvo</span>
                  <span className="text-xs text-white mt-1 block">{prediction.market}</span>
                </div>
                <div className="p-3 bg-black/40 rounded-xl">
                  <span className="text-[10px] uppercase text-white/40 block">Lastro Inicial</span>
                  <span className="text-xs text-white mt-1 block">{prediction.suggestedValue} LF</span>
                </div>
              </div>
              <button 
                onClick={handleMint}
                className="w-full h-14 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2"
              >
                CONFIRMAR MINTAGEM ON-CHAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </motion.div>
  );
};

// --- App Root ---

export default function App() {
  const [activeTab, setActiveTab] = useState("wallet");
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/artifacts")
      .then(res => res.json())
      .then(data => {
        setArtifacts(data);
        setLoading(false);
      });
  }, []);

  // Simple WebSocket integration for "viral" alerts
  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.host}`);
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "NEW_ARTIFACT") {
         console.log("Global Event:", msg.data);
         // Could show a toast here
      }
    };
    return () => socket.close();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30 selection:text-orange-500">
      <Header />
      
      <main className="max-w-md mx-auto min-h-screen relative">
        <AnimatePresence mode="wait">
          {activeTab === "wallet" && (
            <WalletView key="wallet" artifacts={artifacts} />
          )}
          {activeTab === "forge" && (
            <ForgeView key="forge" onMint={(art) => setArtifacts(prev => [art, ...prev])} />
          )}
          {activeTab === "market" && (
            <div className="px-6 pt-32 text-center opacity-20 italic">Nexus de Trocas v0.1 - Disponível em breve</div>
          )}
          {activeTab === "profile" && (
            <div className="px-6 pt-32 text-center opacity-20 italic">Identidade On-Chain v0.1 - Disponível em breve</div>
          )}
        </AnimatePresence>
      </main>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[150%] aspect-square bg-orange-500/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
