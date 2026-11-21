import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

interface WordPressPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

const fallbackSlides: Slide[] = [
  {
    image: hero1,
    title: "Where Everyone Belongs",
    subtitle: "Building stronger, healthier, happier families through inclusive activities",
  },
  {
    image: hero2,
    title: "Celebrating Diversity & Joy",
    subtitle: "Cultural expression, music, dance, and shared experiences for all families",
  },
  {
    image: hero3,
    title: "Supporting Families Together",
    subtitle: "Creating safe spaces for connection, growth, and community resilience",
  },
];

const UNITY_CIRCLE_CATEGORY_ID = 26; // WordPress "united circle" category

const stripHtml = (html: string) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
};

const HeroSlider = () => {
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchUnityCircleSlides = async () => {
      try {
        const response = await fetch(
          `https://happynesscomefirst.com/wp-json/wp/v2/posts?categories=${UNITY_CIRCLE_CATEGORY_ID}&_embed&per_page=6`
        );
        const data: WordPressPost[] = await response.json();
        if (!active || !Array.isArray(data)) return;

        const wpSlides: Slide[] = data
          .filter((post) => post._embedded?.["wp:featuredmedia"]?.[0]?.source_url)
          .map((post) => ({
            image: post._embedded!["wp:featuredmedia"]![0].source_url,
            title: stripHtml(post.title.rendered),
            subtitle: stripHtml(post.excerpt.rendered).slice(0, 140),
          }));

        if (wpSlides.length > 0) {
          setSlides(wpSlides);
          setCurrentSlide(0);
        }
      } catch (error) {
        console.error("Error fetching Unity Circle slides:", error);
      }
    };
    fetchUnityCircleSlides();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-4">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <Link to="/contact">Get Involved</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20" asChild>
                    <Link to="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
