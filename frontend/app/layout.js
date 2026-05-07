import "./globals.css";
import NavigateToOrderLandingBridge from "@/components/navigation/NavigateToOrderLandingBridge";
import localFont from "next/font/local";

const ttFirsNeue = localFont({
  src: "../public/FONTS/fonts/ttfirsneue-regular.woff2",
  variable: "--font-tt-firs-neue",
  display: "swap",
});

export const metadata = {
  title: "MANA",
  description: "Маркетинговое сопровождение: медиа и сайт для малого и среднего бизнеса",
};

/**
 * viewportFit: cover — контент может заходить в safe-area; без этого Safari часто рисует
 * сплошную полосу у нижней панели (см. обсуждения Safari / «Liquid Glass»).
 * theme-color — для Chrome/Android и старых Safari; в новых версиях Safari оттенок часто
 * берётся из CSS (fixed у края экрана + фон html), не только из meta.
 */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  /** Один тон с --background / html: при тёмной теме ОС meta не должен оставаться «левым». */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body
        className={`${ttFirsNeue.variable} subpixel-antialiased`}
        style={{
          fontFamily: "var(--font-tt-firs-neue), system-ui, sans-serif",
          fontSynthesis: "none",
        }}
      >
        <NavigateToOrderLandingBridge />
        {children}
      </body>
    </html>
  );
}
