import "./globals.css";
import NavigationBar from "../components/NavigationBar";
import Provider from "../components/RQProvider";
import { Toaster } from "react-hot-toast";
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
        <Provider>
          <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
            <NavigationBar />
            <div className="flex-1 h-full overflow-y-auto bg-white">
              <Toaster position="top-right" reverseOrder={false} />
              {children}
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
