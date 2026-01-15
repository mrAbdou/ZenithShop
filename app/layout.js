import "./globals.css";
import NavigationBar from "@/components/NavigationBar";
import Provider from "@/components/RQProvider";
import CartProvider from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/context";

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <I18nProvider dictionary={dictionary} locale={locale}>
          <Provider>
            <CartProvider>
              <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
                <NavigationBar />
                <div className="flex-1 h-full overflow-y-auto bg-white">
                  <Toaster position="top-right" reverseOrder={false} />
                  {children}
                </div>
              </div>
            </CartProvider>
          </Provider>
        </I18nProvider>
      </body>
    </html>
  );
}
