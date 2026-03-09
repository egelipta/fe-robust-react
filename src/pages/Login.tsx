import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      src: "/brand-green.png",
      alt: "Telematic Tracking",
      title: "Track fleet in real-time",
      subtitle: "Monitor vessel movement and status from one dashboard.",
      bgClass:
        "bg-[radial-gradient(circle_at_20%_20%,#16a34a_0%,#166534_40%,#0f172a_100%)]",
    },
    {
      src: "/logo-green.png",
      alt: "Monitoring system",
      title: "Operational visibility",
      subtitle: "Get route, asset, and user activity in one workflow.",
      bgClass:
        "bg-[radial-gradient(circle_at_80%_20%,#22c55e_0%,#15803d_45%,#052e16_100%)]",
    },
    {
      src: "/logo-white.png",
      alt: "Secure access",
      title: "Secure access control",
      subtitle: "Login with role-based access for every team member.",
      bgClass:
        "bg-[radial-gradient(circle_at_50%_10%,#334155_0%,#1e293b_45%,#020617_100%)]",
    },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // extract form values
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const username = (formData.get("username") as string) || "";
    const password = (formData.get("password") as string) || "";

    setError("");
    setLoading(true);

    login(username, password)
      .then((res) => {
        // If backend indicates success navigate
        if (res && (res.success === true || res.status_code === 200)) {
          navigate("/map-tracking");
        } else {
          setError(res?.message ?? "Login failed");
        }
      })
      .catch((err) => {
        setError(err?.message ?? String(err) ?? "Login failed");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen w-full bg-muted/40 md:grid md:grid-cols-3">
      <div className="flex items-center justify-center p-6 md:col-span-1 md:p-10">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Login</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <Label>Username</Label>
                <Input
                  name="username"
                  type="text"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error ? (
                <div className="text-sm text-red-600">{error}</div>
              ) : null}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="relative hidden overflow-hidden md:col-span-2 md:block">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            } ${slide.bgClass}`}
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-12 text-white">
              <img
                src={slide.src}
                alt={slide.alt}
                className="max-h-36 w-auto object-contain drop-shadow-xl"
              />
              <div className="max-w-xl text-center">
                <h2 className="text-3xl font-bold tracking-tight">
                  {slide.title}
                </h2>
                <p className="mt-3 text-base text-white/85">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={`dot-${slide.src}`}
              type="button"
              aria-label={`Slide ${index + 1}`}
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeSlide ? "w-7 bg-white" : "w-2.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
