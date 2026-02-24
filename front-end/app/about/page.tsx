"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      {/* Banner Header Section */}
      <div 
        className="w-full py-20 md:py-36 relative shadow-lg text-white mb-8"
        style={{
          backgroundImage: 'url(/images/banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          maxHeight: '330px',
        }}
      >
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
        <div className="container mx-auto px-4 relative z-20 text-center">
          <h1 className="text-4xl font-bold mb-6">
            {t("about.title")}
          </h1>
        </div>
      </div>
      
      {/* About Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
        {/* Left: ảnh */}
        <div className="w-full md:w-1/2 h-80 relative rounded-lg overflow-hidden">
          <Image
            src="/images/about/top.jpg"
            alt="Company Banner"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* Right: 2 cột */}
        <div className="w-full md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cột 1 */}
          <div>
            <h2 className="text-xl font-semibold">{t("about.companyNameLabel")}</h2>
            <p>{t("about.companyName")}</p>
          </div>

          {/* Cột 2 */}
          <div>
            <h2 className="text-xl font-semibold">{t("about.representatives")}</h2>
            <p className="whitespace-pre-line">{t("about.representativesInfo")}</p>
          </div>

          {/* Cột 1 */}
          <div>
            <h2 className="text-xl font-semibold">{t("about.tokyoOffice")}</h2>
            <p className="whitespace-pre-line">{t("about.tokyoAddress")}</p>
          </div>

          {/* Cột 2 */}
          <div>
            <h2 className="text-xl font-semibold">{t("about.established")}</h2>
            <p>{t("about.establishedDate")}</p>
          </div>

          {/* Cột 1 */}
          <div>
            <h2 className="text-xl font-semibold">{t("about.osakaOffice")}</h2>
            <p className="whitespace-pre-line">{t("about.osakaAddress")}</p>
          </div>

          {/* Cột 2 */}
          <div>
            <h2 className="text-xl font-semibold">{t("about.capital")}</h2>
            <p>{t("about.capitalAmount")}</p>
          </div>

          {/* Cột 1 */}
          <div>
            <h2 className="text-xl font-semibold">{t("about.fukuokaOffice")}</h2>
            <p className="whitespace-pre-line">{t("about.fukuokaAddress")}</p>
          </div>

          {/* Cột 2 */}
          <div>
            <h2 className="text-xl font-semibold">{t("about.employees")}</h2>
            <p>{t("about.employeesCount")}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("about.businessDescription")}</h2>
        <p className="mb-4">{t("about.businessSummary")}</p>
        <ul className="list-disc pl-5 mb-4">
          {(t("about.businessItems", { returnObjects: true }) as string[]).map((item: string, index: number) => (
            <li key={index} className="mb-2">{item}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("about.companyHistory")}</h2>
        <div className="space-y-4">
          {(t("about.history", { returnObjects: true }) as Array<{date: string, event: string}>).map((item: {date: string, event: string}, index: number) => (
            <div key={index} className="flex">
              <div className="w-32 font-medium">{item.date}</div>
              <div>{item.event}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">{t("about.access")}</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">{t("about.tokyoAccess")}</h3>
            <p className="mb-3">{t("about.tokyoDirections")}</p>
            <div className="rounded-lg overflow-hidden h-80 relative">
              <Image 
                src="/images/about/bot-1.jpg" 
                alt="Tokyo Office Location" 
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">{t("about.osakaAccess")}</h3>
            <p className="mb-3">{t("about.osakaDirections")}</p>
            <div className="rounded-lg overflow-hidden h-80 relative">
              <Image 
                src="/images/about/bot-2.jpg" 
                alt="Osaka Office Location" 
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
