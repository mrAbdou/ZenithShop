import "./globals.css";
import NavigationBar from "../components/NavigationBar";

export const metadata = {
  title: "Home Page",
  description: "displays the recent added products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
          <NavigationBar />
          <div className="flex-1 h-full overflow-y-auto bg-white">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
