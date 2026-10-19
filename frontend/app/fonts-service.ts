import { Inter_Tight } from "next/font/google";

/** Match layout-ivory-psi.vercel.app next/font Inter Tight metrics. */
export const serviceInterTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-service-inter-tight",
});
