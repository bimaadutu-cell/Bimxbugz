"use client";
import { useState, useEffect, useCallback } from "react";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number | string;
  release_date: string;
}

interface WatchingMovie {
  id: number;
  title: string;
}

const SERVERS = [
  { id: "vidlink", label: "VidLink Pro", url: (id: number) => `https://vidlink.pro/movie/${id}?primaryColor=ff0040&secondaryColor=000000&iconColor=ffffff` },
  { id: "vidsrc_to", label: "VidSrc To", url: (id: number) => `https://vidsrc.to/embed/movie/${id}` },
  { id: "vidsrc_cc", label: "VidSrc CC V2", url: (id: number) => `https://vidsrc.cc/v2/embed/movie/${id}` },
  { id: "embed_su", label: "Embed SU", url: (id: number) => `https://embed.su/embed/movie/${id}` },
  { id: "superembed", label: "SuperEmbed", url: (id: number) => `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1` },
  { id: "autoembed", label: "AutoEmbed", url: (id: number) => `https://autoembed.cc/movie/tmdb/${id}` },
  { id: "pstream", label: "P-Stream", url: (id: number) => `https://iframe.pstream.org/media/tmdb-movie-${id}` },
  { id: "videasy", label: "Videasy 4K", url: (id: number) => `https://player.videasy.net/movie/${id}` },
];

const CATEGORIES = [
  { id: "popular", label: "🔥 Popular 150+" },
  { id: "trending", label: "📈 Trending" },
  { id: "top_rated", label: "⭐ Top Rated" },
  { id: "upcoming", label: "🎬 Upcoming" },
  { id: "action", label: "⚔️ Action" },
  { id: "horror", label: "👻 Horror" },
  { id: "comedy", label: "😂 Comedy" },
  { id: "romance", label: "💕 Romance" },
];

export default function CinemaSection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("popular");
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [watching, setWatching] = useState<WatchingMovie | null>(null);
  const [server, setServer] = useState<string>("vidlink");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sourceInfo, setSourceInfo] = useState<string>("");

  const fetchMovies = useCallback(async (pageNum: number, cat: string, query: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      else params.set("category", cat);
      params.set("page", pageNum.toString());
      const res = await fetch(`/api/movies?${params}`, { cache: "no-store" });
      const data = await res.json();
      if (pageNum === 1) setMovies(data.results || []);
      else setMovies(prev => [...prev, ...(data.results || [])]);
      setTotalPages(data.total_pages || 1);
      setSourceInfo(data.source || "");
    } catch {
      if (pageNum === 1) setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchMovies(1, category, searchQuery);
  }, [category, searchQuery, fetchMovies]);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      const next = page + 1;
      setPage(next);
      fetchMovies(next, category, searchQuery);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
    setPage(1);
  };

  if (watching) {
    const serverConfig = SERVERS.find(s => s.id === server) || SERVERS[0];
    const iframeUrl = serverConfig.url(watching.id);

    return (
      <div className="h-full flex flex-col bg-black min-h-[calc(100vh-56px)]">
        <div className="bg-gradient-to-br from-black to-[#1a0005] p-2.5 flex items-center gap-2.5 border-b border-[#ff0040] shrink-0">
          <button onClick={() => setWatching(null)} className="bg-white/10 border border-white/20 rounded-md px-3 py-1.5 text-white cursor-pointer text-xs font-bold">
            ← KEMBALI
          </button>
          <span className="digital-font text-white font-bold text-xs flex-1 overflow-hidden text-ellipsis whitespace-nowrap drop-shadow-[0_0_8px_#ff0040]">
            🎬 {watching.title} • {serverConfig.label}
          </span>
        </div>

        <div className="flex gap-1.5 px-2 py-2 overflow-x-auto scrollbar-hide bg-black/90 border-b border-[rgba(255,0,64,0.15)] shrink-0">
          {SERVERS.map(s => (
            <button
              key={s.id}
              onClick={() => setServer(s.id)}
              className="shrink-0 px-2.5 py-1.5 rounded-md border text-[10px] font-bold cursor-pointer"
              style={{
                borderColor: server === s.id ? "#ff0040" : "rgba(255,255,255,0.1)",
                background: server === s.id ? "linear-gradient(135deg, #000, #ff0040)" : "rgba(255,255,255,0.06)",
                color: server === s.id ? "#fff" : "rgba(255,255,255,0.6)",
                boxShadow: server === s.id ? "0 0 12px rgba(255,0,64,0.4)" : "none",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-black relative min-h-[300px]">
          <iframe
            src={iframeUrl}
            className="w-full h-full border-none absolute inset-0 bg-black"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="digital-font text-[18px] font-black bg-gradient-to-br from-white to-[#ff0040] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,0,64,0.5)]">
          🎬 GLOBAL CINEMA V2 — 150+ FILM HD 120FPS
        </h2>
        <p className="digital-font text-white/50 text-[8px] tracking-[1px] mt-1">TMDB REAL IDS + 8 SERVERS • 1080p 4K • NO LAG 120FPS</p>
        <p className="digital-font text-[8px] mt-1" style={{ color: sourceInfo.includes("live") ? "#00ff88" : "#ffaa00" }}>
          SOURCE: {sourceInfo.toUpperCase()} • {movies.length} FILM • PAGE {page}/{totalPages} • 120FPS
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Cari 150+ film TMDB real..."
          className="flex-1 bg-black/65 border border-[rgba(255,0,64,0.32)] rounded-lg px-3.5 py-2.5 text-white text-[13px]"
        />
        <button type="submit" className="bg-gradient-to-br from-black to-[#ff0040] border border-[#ff0040] rounded-lg px-4 py-2.5 text-white font-extrabold text-xs shadow-[0_0_15px_rgba(255,0,64,0.3)]">
          CARI
        </button>
        {searchQuery && (
          <button type="button" onClick={() => { setSearch(""); setSearchQuery(""); }} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white cursor-pointer text-xs">✕</button>
        )}
      </form>

      {!searchQuery && (
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); setPage(1); }}
              className="shrink-0 px-3 py-1.5 rounded-full border text-[11px] whitespace-nowrap"
              style={{
                borderColor: category === cat.id ? "#ff0040" : "rgba(255,255,255,0.1)",
                background: category === cat.id ? "linear-gradient(135deg, #000, #ff0040)" : "rgba(0,0,0,0.5)",
                color: category === cat.id ? "#fff" : "rgba(255,255,255,0.6)",
                fontWeight: category === cat.id ? 700 : 400,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {loading && movies.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-[40px] mb-3 inline-block animate-spin-slow">🎬</div>
          <p className="digital-font text-[#ff0040] text-[11px] drop-shadow-[0_0_10px_#ff0040]">MEMUAT 150+ FILM HD 120FPS...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-12"><p className="text-[40px] mb-2">🎬</p><p className="digital-font text-[11px] text-white/50">Tidak ada film. Coba kata kunci lain.</p></div>
      ) : (
        <>
          <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))" }}>
            {movies.map((movie) => (
              <div
                key={`${movie.id}-${movie.title}`}
                onClick={() => setWatching({ id: movie.id, title: movie.title })}
                className="cursor-pointer rounded-[10px] overflow-hidden bg-black/60 border border-[rgba(255,0,64,0.15)] hover:border-[#ff0040] hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(0,0,0,0.85),0_0_24px_rgba(255,0,64,0.32)] transition-all duration-200"
              >
                <div className="relative">
                  {movie.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} className="w-full aspect-[2/3] object-cover block" loading="lazy" onError={(e) => {(e.target as HTMLImageElement).src = `https://via.placeholder.com/300x450/000000/ff0040?text=${encodeURIComponent(movie.title.slice(0,15))}`}} />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gradient-to-br from-black to-[#1a0005] flex items-center justify-center text-[32px]">🎬</div>
                  )}
                  <div className="absolute top-1.5 right-1.5 bg-black/90 border border-[#ff0040] rounded px-1.5 py-0.5 text-[#ff0040] text-[8px] font-extrabold shadow-[0_0_8px_rgba(255,0,64,0.4)]">HD 120FPS</div>
                </div>
                <div className="p-2">
                  <p className="text-white text-[11px] font-semibold m-0 mb-1 overflow-hidden text-ellipsis whitespace-nowrap leading-[1.3]">{movie.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#ff0040] text-[9px] font-bold drop-shadow-[0_0_5px_#ff0040]">⭐ {typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : movie.vote_average}</span>
                    <span className="text-white/40 text-[9px]">{movie.release_date?.slice(0, 4) || "2024"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {page < totalPages && (
            <div className="text-center mt-4">
              <button onClick={loadMore} disabled={loading} className="bg-gradient-to-br from-black to-[#ff0040] border border-[#ff0040] rounded-lg px-5 py-2.5 text-white font-bold text-[11px] shadow-[0_0_15px_rgba(255,0,64,0.3)] disabled:opacity-50">
                {loading ? "⏳ LOADING..." : `📄 LOAD MORE — PAGE ${page + 1}/${totalPages} — 150+ FILM`}
              </button>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="digital-font text-white/25 text-[8px] tracking-[1px]">POWERED BY TMDB REAL + 8 SERVERS • 120FPS ULTRA SMOOTH • BLACK RED WHITE NEON</p>
            <p className="digital-font text-[rgba(255,0,64,0.5)] text-[8px] mt-1">{movies.length} FILM LOADED • KLIK UNTUK STREAMING HD LANGSUNG</p>
          </div>
        </>
      )}
    </div>
  );
}
