import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 导航栏 */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Chinese Name</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-foreground/70 hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#about" className="text-foreground/70 hover:text-foreground transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Find Your Authentic
                <span className="text-primary block">Chinese Name</span>
              </h1>
              <p className="text-xl text-foreground/70 mb-8 max-w-3xl mx-auto">
                Get a meaningful Chinese name with correct pronunciation and cultural relevance. 
                Perfect for foreigners seeking authentic Chinese names.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/preferences"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors group"
                >
                  Start Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Why Choose Our Name Generator?
              </h2>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                We provide authentic Chinese names with deep cultural meaning and perfect pronunciation.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Meaningful Names</h3>
                <p className="text-foreground/70">
                  Every name comes with detailed meaning explanations and cultural significance.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Perfect Pronunciation</h3>
                <p className="text-foreground/70">
                  Learn the correct pronunciation with pinyin, tones, and audio playback.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Personalized</h3>
                <p className="text-foreground/70">
                  Names are generated based on your preferred qualities and characteristics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cultural Tip Section */}
        <section id="about" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Understanding Chinese Names
            </h2>
            <div className="bg-accent rounded-lg p-8">
              <p className="text-lg text-accent-foreground mb-4">
                <strong>Cultural Insight:</strong> In Chinese culture, names carry deep significance and are believed to influence one's destiny.
              </p>
              <p className="text-accent-foreground/80">
                Chinese names typically consist of a family name (surname) followed by a given name. 
                The meaning of each character is carefully chosen to reflect positive qualities, 
                hopes, and aspirations for the person.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-foreground/60">
            <p>&copy; 2024 Chinese Name Generator. Made with ❤️ for cultural connection.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
