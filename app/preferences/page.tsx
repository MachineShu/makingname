'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Gender, Quality } from '@/lib/types';
import { getQualities } from '@/lib/names';
import { cn } from '@/lib/utils';

export default function PreferencesPage() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const qualities = getQualities();

  const handleQualityToggle = (qualityId: string) => {
    setSelectedQualities(prev => {
      if (prev.includes(qualityId)) {
        return prev.filter(id => id !== qualityId);
      } else if (prev.length < 3) {
        return [...prev, qualityId];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    if (selectedGender && selectedQualities.length > 0) {
      const params = new URLSearchParams({
        gender: selectedGender,
        qualities: selectedQualities.join(',')
      });
      router.push(`/results?${params.toString()}`);
    }
  };

  const canProceed = selectedGender && selectedQualities.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="text-sm text-foreground/60">
              Step 1 of 2
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Tell us about your preferences
          </h1>
          <p className="text-lg text-foreground/70">
            Help us find the perfect Chinese name that reflects your personality
          </p>
        </div>

        <div className="space-y-12">
          {/* 性别选择 */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Select your gender:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => setSelectedGender('male')}
                className={cn(
                  "p-6 rounded-lg border-2 transition-all duration-200 text-left",
                  selectedGender === 'male'
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50 text-foreground"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-lg">Male</div>
                    <div className="text-sm opacity-70">男性</div>
                  </div>
                  {selectedGender === 'male' && (
                    <Check className="h-5 w-5" />
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setSelectedGender('female')}
                className={cn(
                  "p-6 rounded-lg border-2 transition-all duration-200 text-left",
                  selectedGender === 'female'
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50 text-foreground"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-lg">Female</div>
                    <div className="text-sm opacity-70">女性</div>
                  </div>
                  {selectedGender === 'female' && (
                    <Check className="h-5 w-5" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* 品质选择 */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Choose 1-3 qualities you'd like your name to embody:
            </h2>
            <p className="text-sm text-foreground/60 mb-6">
              Selected: {selectedQualities.length}/3
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {qualities.map((quality) => {
                const isSelected = selectedQualities.includes(quality.id);
                const isDisabled = !isSelected && selectedQualities.length >= 3;
                
                return (
                  <button
                    key={quality.id}
                    onClick={() => handleQualityToggle(quality.id)}
                    disabled={isDisabled}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all duration-200 text-center relative",
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : isDisabled
                        ? "border-border/50 text-foreground/30 cursor-not-allowed"
                        : "border-border hover:border-primary/50 text-foreground hover:bg-primary/5"
                    )}
                  >
                    <div className="font-medium text-sm">{quality.name}</div>
                    <div className="text-xs opacity-70 mt-1">{quality.nameZh}</div>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="text-center pt-8">
            <button
              onClick={handleSubmit}
              disabled={!canProceed}
              className={cn(
                "inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg transition-all duration-200",
                canProceed
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 group"
                  : "bg-secondary text-secondary-foreground cursor-not-allowed"
              )}
            >
              Find Names
              {canProceed && (
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
            
            {!canProceed && (
              <p className="text-sm text-foreground/60 mt-2">
                Please select your gender and at least one quality
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}