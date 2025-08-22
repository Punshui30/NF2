import * as React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

export default function DemoSparkles() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-black">
      <SparklesCore className="absolute inset-0" background="transparent" particleDensity={140} />
      <div className="relative z-10 flex h-full items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Sparkles</h1>
      </div>
    </div>
  );
}
