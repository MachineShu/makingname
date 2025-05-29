'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, Volume2, RotateCcw } from 'lucide-react';
import { ChineseName, Gender } from '@/lib/types';
import { generateNames, favorites, speakText } from '@/lib/names';
import { cn } from '@/lib/utils';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [names, setNames] = useState<ChineseName[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const gender = searchParams.get('gender') as Gender;
  const qualitiesParam = searchParams.get('qualities');
  const selectedQualities = qualitiesParam ? qualitiesParam.split(',') : [];

  useEffect(() => {
    if (gender && selectedQualities.length > 0) {
      const generatedNames = generateNames({
        gender,
        selectedQualities
      });
      setNames(generatedNames);
      setFavoriteIds(favorites.get());
      setLoading(false);
    } else {
      router.push('/preferences');
    }
  }, [gender, selectedQualities, router]);

  const handleFavoriteToggle = (nameId: string) => {
    if (favoriteIds.includes(nameId)) {
      favorites.remove(nameId);
      setFavoriteIds(prev => prev.filter(id => id !== nameId));
    } else {
      favorites.add(nameId);
      setFavoriteIds(prev => [...prev, nameId]);
    }
  };

  const handleSpeak = (text: string) => {
    speakText(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Generating your perfect names...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/preferences" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Preferences</span>
            </Link>
            <Link href="/favorites" className="text-foreground hover:text-primary transition-colors">
              My Favorites ({favoriteIds.length})
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Here are some name suggestions for you!
          </h1>
          <p className="text-lg text-foreground/70">
            Found {names.length} names for {gender === 'male' ? 'male' : 'female'} with your selected qualities
          </p>
        </div>

        {names.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {names.map((name) => {
              const isFavorite = favoriteIds.includes(name.id);
              
              return (
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
                  
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => handleSpeak(name.characters)}
                      className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      title="Play pronunciation"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleFavoriteToggle(name.id)}
                      className={cn(
                        "p-2 rounded-full transition-colors",
                        isFavorite
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-secondary text-foreground/60 hover:bg-red-100 hover:text-red-600"
                      )}
                      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                    </button>
                    
                    <Link
                      href={`/name/${name.id}`}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-foreground/70 mb-6">
              No names found for your preferences. Try adjusting your selections.
            </p>
            <Link
              href="/preferences"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Link>
          </div>
        )}

        {/* 文化提示 */}
        <div className="bg-accent rounded-lg p-6 text-center">
          <h3 className="font-semibold text-accent-foreground mb-2">
            💡 Cultural Tip
          </h3>
          <p className="text-accent-foreground/80">
            In China, family names come first, followed by the given name. 
            The meaning of a name is highly valued and believed to influence one's character and destiny.
          </p>
        </div>
      </main>
    </div>
  );
}