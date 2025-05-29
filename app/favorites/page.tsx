'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Volume2, Trash2, RotateCcw } from 'lucide-react';
import { ChineseName } from '@/lib/types';
import { getNameById, favorites, speakText } from '@/lib/names';
import { cn } from '@/lib/utils';

export default function FavoritesPage() {
  const [favoriteNames, setFavoriteNames] = useState<ChineseName[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favoriteIds = favorites.get();
    const names = favoriteIds
      .map(id => getNameById(id))
      .filter((name): name is ChineseName => name !== undefined);
    
    setFavoriteNames(names);
    setLoading(false);
  }, []);

  const handleRemoveFavorite = (nameId: string) => {
    favorites.remove(nameId);
    setFavoriteNames(prev => prev.filter(name => name.id !== nameId));
  };

  const handleSpeak = (text: string) => {
    speakText(text);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to remove all favorites?')) {
      favoriteNames.forEach(name => favorites.remove(name.id));
      setFavoriteNames([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            {favoriteNames.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700 transition-colors text-sm"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Your Favorite Names
          </h1>
          <p className="text-lg text-foreground/70">
            {favoriteNames.length > 0 
              ? `You have ${favoriteNames.length} favorite name${favoriteNames.length > 1 ? 's' : ''}`
              : 'You haven\'t saved any names yet'
            }
          </p>
        </div>

        {favoriteNames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteNames.map((name) => (
              <div key={name.id} className="bg-secondary/30 rounded-lg p-6 border border-border hover:border-primary/50 transition-all duration-200">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {name.characters}
                  </h3>
                  <p className="text-lg text-foreground/70 mb-1">
                    {name.pinyin}
                  </p>
                  <p className="text-sm text-foreground/60">
                    {name.meaning}
                  </p>
                </div>
                
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleSpeak(name.characters)}
                    className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    title="Play pronunciation"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleRemoveFavorite(name.id)}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  
                  <Link
                    href={`/name/${name.id}`}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No favorites yet
            </h2>
            <p className="text-foreground/70 mb-6">
              Start exploring Chinese names and save the ones you love!
            </p>
            <Link
              href="/preferences"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Find Names
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}