import localFont from "next/font/local";
import "./globals.css";
import NavigateToOrderLandingBridge from "@/components/navigation/NavigateToOrderLandingBridge";

/**
 * Involve — статические TTF из app/fonts (Regular / Medium / SemiBold / Bold + Oblique).
 * Веса: Regular 400, Medium 500, SemiBold 600, Bold 700.
 */
const involve = localFont({
  src: [
    { path: "./fonts/Involve-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Involve-Oblique.ttf", weight: "400", style: "italic" },
    { path: "./fonts/Involve-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Involve-MediumOblique.ttf", weight: "500", style: "italic" },
    { path: "./fonts/Involve-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Involve-SemiBoldOblique.ttf", weight: "600", style: "italic" },
    { path: "./fonts/Involve-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Involve-BoldOblique.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-involve",
  display: "swap",
});

export const metadata = {
  title: "МНОЖИТЕЛ",
  description: "Подготовка к экзаменам",
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
  themeColor: "#F5F5F5",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body
        className={`${involve.variable} subpixel-antialiased`}
        style={{
          fontFamily: "var(--font-involve), system-ui, sans-serif",
          fontSynthesis: "none",
        }}
      >
        <NavigateToOrderLandingBridge />
        {children}
      </body>
    </html>
  );
}
