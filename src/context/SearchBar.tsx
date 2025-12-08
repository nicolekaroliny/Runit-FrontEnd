'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RaceService } from '@/lib/api/raceservice';
import { BlogService } from '@/lib/api/blogservice';
import { Race } from '@/types/race.types';
import { BlogPost } from '@/types/blog.types';
import { Search, X, MapPin, Calendar, FileText } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [races, setRaces] = useState<Race[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery.trim().length < 2) {
      setRaces([]);
      setPosts([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const [racesResult, postsResult] = await Promise.allSettled([
          RaceService.searchRaces(searchQuery),
          BlogService.searchPosts(searchQuery),
        ]);

        setRaces(racesResult.status === 'fulfilled' ? racesResult.value : []);
        setPosts(postsResult.status === 'fulfilled' ? postsResult.value : []);
        setIsOpen(true);
      } catch (error) {
        console.error('Erro na busca:', error);
        setRaces([]);
        setPosts([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const handleClear = () => {
    setSearchQuery('');
    setRaces([]);
    setPosts([]);
    setIsOpen(false);
  };

  const handleRaceClick = (raceId: number) => {
    router.push(`/corridas?highlight=${raceId}`);
    handleClear();
  };

  const handlePostClick = (postSlug: string) => {
    router.push(`/blog/${postSlug}`);
    handleClear();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const totalResults = races.length + posts.length;

  return (
    <div className="hidden lg:block relative w-96 z-[2100]" ref={searchRef}>
      <div className="flex items-center bg-card rounded-full shadow-md px-4 py-2.5 gap-3 border border-border cursor-text">
        <Search className="w-5 h-5 text-primary flex-shrink-0 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar corridas ou posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (totalResults > 0) setIsOpen(true);
          }}
          className="bg-transparent outline-none text-foreground text-base flex-1 placeholder:text-muted-foreground cursor-text"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Limpar busca"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isSearching && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent pointer-events-none" />
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (searchQuery.trim().length >= 2) && (
        <div className="absolute top-full mt-2 w-full bg-card rounded-lg shadow-xl border border-border max-h-[500px] overflow-y-auto z-[2150]">
          {totalResults === 0 && !isSearching && (
            <div className="p-6 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum resultado encontrado para &quot;{searchQuery}&quot;</p>
            </div>
          )}

          {/* Races Section */}
          {races.length > 0 && (
            <div className="border-b border-border">
              <div className="px-4 py-2 bg-muted">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Corridas ({races.length})
                </h3>
              </div>
              {races.slice(0, 5).map((race) => (
                <button
                  key={race.id}
                  onClick={() => handleRaceClick(race.id)}
                  className="w-full px-4 py-3 hover:bg-muted transition-colors text-left flex items-start gap-3 border-b border-border last:border-b-0"
                >
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {race.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {race.city}, {race.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(race.raceDate)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
              {races.length > 5 && (
                <div className="px-4 py-2 text-xs text-center text-muted-foreground">
                  +{races.length - 5} mais corridas
                </div>
              )}
            </div>
          )}

          {/* Posts Section */}
          {posts.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-muted">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  Posts do Blog ({posts.length})
                </h3>
              </div>
              {posts.slice(0, 5).map((post) => (
                <button
                  key={post.id}
                  onClick={() => handlePostClick(post.slug)}
                  className="w-full px-4 py-3 hover:bg-muted transition-colors text-left flex items-start gap-3 border-b border-border last:border-b-0"
                >
                  <FileText className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {post.title}
                    </p>
                    {post.excerpt && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </button>
              ))}
              {posts.length > 5 && (
                <div className="px-4 py-2 text-xs text-center text-muted-foreground">
                  +{posts.length - 5} mais posts
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
