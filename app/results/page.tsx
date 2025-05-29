'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, Volume2, RotateCcw } from 'lucide-react';
import { ChineseName, Gender } from '@/lib/types';
import { generateNames, favorites, speakText } from '@/lib/names';
import { cn } from '@/lib/utils';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [names, setNames] = useState<ChineseName[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const gender = searchParams.get('gender') as Gender;
  const qualitiesParam = searchParams.get('qualities');
  
  const selectedQualities = useMemo(() => {
    return qualitiesParam ? qualitiesParam.split(',') : [];
  }, [qualitiesParam]);

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
                      {name.tone}
                    </p>
                  </div>
                  
                  <p className="text-foreground/80 mb-4 text-center">
                    {name.meaning}
                  </p>
                  
                  <div className="flex justify-center space-x-2 mb-4">
                    <button
                      onClick={() => handleSpeak(name.characters)}
                      className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                      title="Pronounce name"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleFavoriteToggle(name.id)}
                      className={cn(
                        "p-2 rounded-full transition-colors",
                        isFavorite
                          ? "bg-red-100 hover:bg-red-200 text-red-600"
                          : "bg-secondary hover:bg-secondary/80 text-foreground/60"
                      )}
                      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                    </button>
                    
                    <Link
                      href={`/name/${name.id}`}
                      className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground/60 transition-colors"
                      title="View details"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="text-center">
                    <Link
                      href={`/name/${name.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70 mb-4">No names found for your preferences.</p>
            <Link
              href="/preferences"
              className="inline-flex items-center space-x-2 text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Try different preferences</span>
            </Link>
          </div>
        )}

        {/* Cultural Tip */}
        <div className="bg-accent rounded-lg p-6 text-center">
          <h3 className="font-semibold text-accent-foreground mb-2">
            💡 Cultural Tip
          </h3>
          <p className="text-accent-foreground/80">
            In China, family names come first, followed by the given name. 
            The meaning of a name is highly valued and believed to influence one&apos;s character and destiny.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}