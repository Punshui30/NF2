import * as React from "react";
import { ShaderAnimation } from "@/components/ui/shader-animation";

export default function DemoShader() {
  return (
    <div className="relative flex h-[650px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border bg-blue-700">
      <ShaderAnimation />
      <span className="absolute pointer-events-none z-10 text-center text-5xl sm:text-7xl leading-none font-semibold tracking-tighter whitespace-pre-wrap text-white">
        constellation taking shape
      </span>
    </div>
  );
}
