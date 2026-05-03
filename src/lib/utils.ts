import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth") {
  document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
}
