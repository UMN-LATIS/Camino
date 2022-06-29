import config from "@/camino-trekker/config";

export default function useConfig(): Readonly<typeof config> {
  return config;
}
