import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { setTheme } from "./lib/theme";

function App() {
  return (
    <div className="h-screen p-4 flex items-center justify-center">
      <Card className="w-full max-w-md space-y-4">
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setTheme("light")}>
              Light
            </Button>
            <Button variant="outline" onClick={() => setTheme("dark")}>
              Dark
            </Button>
            <Button variant="outline" onClick={() => setTheme("system")}>
              System
            </Button>
          </div>

          <Input placeholder="Input here..." />

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
            nulla fugit quibusdam voluptatum recusandae.
          </p>

          <Button>Click me</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
