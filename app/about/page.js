import { getDictionary } from '@/lib/i18n/dictionary';
import { getLocale } from '@/lib/i18n/server';

export const metadata = {
  title: "About Us | ZenithShop",
  description: "Learn about ZenithShop's journey, values, and commitment to delivering exceptional quality products and unparalleled customer experiences. Discover our story and vision.",
}

export default async function AboutPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <div className="min-h-screen p-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-3xl p-12 mb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
            <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {t.about.heroTitle}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> {t.about.heroTitleHighlight}</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t.about.heroSubtitle}
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid md:grid-cols-2 gap-12 mb-12">
        {/* Our Story */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t.about.ourStory}</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            {t.about.ourStoryDescription}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t.about.ourStoryDescription2}
          </p>
        </div>

        {/* Our Values */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t.about.ourValues}</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">01</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{t.about.qualityFirst}</h3>
                <p className="text-gray-600 text-sm">{t.about.qualityFirstDescription}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-indigo-600 font-bold text-sm">02</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{t.about.customerFocus}</h3>
                <p className="text-gray-600 text-sm">{t.about.customerFocusDescription}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 font-bold text-sm">03</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{t.about.innovation}</h3>
                <p className="text-gray-600 text-sm">{t.about.innovationDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-2xl p-8 mb-12">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600 font-medium">{t.about.stats.happyCustomers}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
            <div className="text-gray-600 font-medium">{t.about.stats.productsSold}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-indigo-600 mb-2">5</div>
            <div className="text-gray-600 font-medium">{t.about.stats.yearsExperience}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600 font-medium">{t.about.stats.support}</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.about.readyToShop}</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          {t.about.readyToShopDescription}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/products"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {t.about.browseProducts}
          </a>
          <a
            href="/contact"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            {t.about.contactUs}
          </a>
        </div>
      </div>
    </div>
  );
}
