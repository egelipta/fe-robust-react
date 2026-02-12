import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
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

            {error ? <div className="text-sm text-red-600">{error}</div> : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
