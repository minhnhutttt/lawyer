"use client";

import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-black">
        {t("termsOfService.title")}
      </h1>
      <div className="prose max-w-none text-black dark:text-black dark:prose-invert">
        <p className="mb-8">{t("termsOfService.introduction")}</p>

        {/* Chapter 1 */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">
          {t("termsOfService.chapter1.title")}
        </h2>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter1.article1.title")}
        </h3>
        <p>{t("termsOfService.chapter1.article1.service")}</p>
        <p>{t("termsOfService.chapter1.article1.provider")}</p>
        <p>{t("termsOfService.chapter1.article1.generalUser")}</p>
        <p>{t("termsOfService.chapter1.article1.lawyerUser")}</p>
        <p>{t("termsOfService.chapter1.article1.registeredUser")}</p>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter1.article2.title")}
        </h3>
        <p>{t("termsOfService.chapter1.article2.content")}</p>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter1.article3.title")}
        </h3>
        <p>{t("termsOfService.chapter1.article3.content")}</p>

        {/* Chapter 2 */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-black ">
          {t("termsOfService.chapter2.title")}
        </h2>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter2.article4.title")}
        </h3>
        <p>{t("termsOfService.chapter2.article4.content1")}</p>
        <p>{t("termsOfService.chapter2.article4.content2")}</p>
        <p>{t("termsOfService.chapter2.article4.content3")}</p>
        <ul className="list-disc pl-5 my-2 text-black ">
          <li>{t("termsOfService.chapter2.article4.reason1")}</li>
          <li>{t("termsOfService.chapter2.article4.reason2")}</li>
          <li>{t("termsOfService.chapter2.article4.reason3")}</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter2.article5.title")}
        </h3>
        <p>{t("termsOfService.chapter2.article5.content")}</p>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter2.article6.title")}
        </h3>
        <p>{t("termsOfService.chapter2.article6.content1")}</p>
        <p>{t("termsOfService.chapter2.article6.content2")}</p>

        {/* Chapter 3 */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-black ">
          {t("termsOfService.chapter3.title")}
        </h2>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter3.article7.title")}
        </h3>
        <p>{t("termsOfService.chapter3.article7.content")}</p>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter3.article8.title")}
        </h3>
        <p>{t("termsOfService.chapter3.article8.content1")}</p>
        <p>{t("termsOfService.chapter3.article8.content2")}</p>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter3.article9.title")}
        </h3>
        <p>{t("termsOfService.chapter3.article9.content1")}</p>
        <p>{t("termsOfService.chapter3.article9.content2")}</p>

        {/* Chapter 4 */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-black ">
          {t("termsOfService.chapter4.title")}
        </h2>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter4.article10.title")}
        </h3>
        <p>{t("termsOfService.chapter4.article10.content")}</p>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter4.article11.title")}
        </h3>
        <p>{t("termsOfService.chapter4.article11.content1")}</p>
        <p>{t("termsOfService.chapter4.article11.content2")}</p>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter4.article12.title")}
        </h3>
        <p>{t("termsOfService.chapter4.article12.content")}</p>

        {/* Chapter 5 */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-black ">
          {t("termsOfService.chapter5.title")}
        </h2>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter5.article13.title")}
        </h3>
        <p>{t("termsOfService.chapter5.article13.content")}</p>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter5.article14.title")}
        </h3>
        <p>{t("termsOfService.chapter5.article14.content")}</p>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter5.article15.title")}
        </h3>
        <p>{t("termsOfService.chapter5.article15.content")}</p>

        <h3 className="text-xl font-medium mt-6 mb-2 text-black ">
          {t("termsOfService.chapter5.article16.title")}
        </h3>
        <p>{t("termsOfService.chapter5.article16.content")}</p>

        {/* Effective Date */}
        <p className="mt-8 font-semibold text-black ">
          {t("termsOfService.effectiveDate")}
        </p>
      </div>
    </div>
  );
}
