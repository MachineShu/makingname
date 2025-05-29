'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, Volume2, Share2 } from 'lucide-react';
import { ChineseName } from '@/lib/types';
import { getNameById, favorites, speakText } from '@/lib/names';
import { cn } from '@/lib/utils';

export default function NameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [name, setName] = useState<ChineseName | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const nameId = params.id as string;

  useEffect(() => {
    if (nameId) {
      const foundName = getNameById(nameId);
      if (foundName) {
        setName(foundName);
        setIsFavorite(favorites.has(nameId));
      } else {
        router.push('/results');
      }
      setLoading(false);
    }
  }, [nameId, router]);

  const handleFavoriteToggle = () => {
    if (!name) return;
    
    if (isFavorite) {
      favorites.remove(name.id);
      setIsFavorite(false);
    } else {
      favorites.add(name.id);
      setIsFavorite(true);
    }
  };

  const handleSpeak = () => {
    if (name) {
      speakText(name.characters);
    }
  };

  const handleShare = async () => {
    if (!name) return;
    
    const shareData = {
      title: `Chinese Name: ${name.characters}`,
      text: `Check out this beautiful Chinese name: ${name.characters} (${name.pinyin}) - ${name.meaning}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // 用户取消分享或其他错误
      }
    } else {
      // 降级到复制链接
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!name) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Name not found</h1>
          <Link href="/results" className="text-primary hover:underline">
            Back to Results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                title="Share this name"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          {/* 主要名字显示 */}
          <div className="mb-8">
            <h1 className="text-6xl lg:text-8xl font-bold text-foreground mb-4">
              {name.characters}
            </h1>
            <p className="text-2xl lg:text-3xl text-foreground/70 mb-2">
              {name.pinyin}
            </p>
            <p className="text-lg text-foreground/60">
              {name.tone}
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <button
              onClick={handleSpeak}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Volume2 className="h-5 w-5" />
              <span>Play Pronunciation</span>
            </button>
            
            <button
              onClick={handleFavoriteToggle}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors",
                isFavorite
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-secondary text-foreground hover:bg-red-100 hover:text-red-600"
              )}
            >
              <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
              <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
            </button>
          </div>
        </div>

        {/* 详细信息 */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* 含义解释 */}
          <div className="bg-secondary/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Meaning & Significance
            </h2>
            <p className="text-foreground/80 text-lg mb-4">
              {name.meaning}
            </p>
            {name.culturalNote && (
              <div className="bg-accent rounded-lg p-4">
                <h3 className="font-medium text-accent-foreground mb-2">
                  Cultural Note
                </h3>
                <p className="text-accent-foreground/80 text-sm">
                  {name.culturalNote}
                </p>
              </div>
            )}
          </div>

          {/* 特质标签 */}
          <div className="bg-secondary/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Associated Qualities
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {name.qualities.map((quality) => (
                <span
                  key={quality}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {quality}
                </span>
              ))}
            </div>
            
            <div className="text-sm text-foreground/60">
              <p className="mb-2">
                <strong>Gender:</strong> {name.gender === 'male' ? 'Male (男性)' : 'Female (女性)'}
              </p>
              <p>
                <strong>Pronunciation Guide:</strong> Listen to the audio above for correct tones and pronunciation.
              </p>
            </div>
          </div>
        </div>

        {/* 使用建议 */}
        <div className="mt-12 bg-accent rounded-lg p-6">
          <h2 className="text-xl font-semibold text-accent-foreground mb-4">
            💡 How to Use Your Chinese Name
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-accent-foreground/80">
            <div>
              <h3 className="font-medium mb-2">Writing Your Name</h3>
              <p className="text-sm">
                In Chinese, the family name comes first, followed by the given name. 
                For example: 李{name.characters} (Li {name.characters})
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Pronunciation Tips</h3>
              <p className="text-sm">
                Practice the tones carefully as they change the meaning. 
                Use the audio feature to perfect your pronunciation.
              </p>
            </div>
          </div>
        </div>

        {/* 相关操作 */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/results"
              className="px-6 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              View More Names
            </Link>
            <Link
              href="/favorites"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              View My Favorites
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}