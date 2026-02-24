"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { createQuestion } from "@/lib/services";
import { QuestionCreateRequest } from "@/lib/types/questions";
import { Button } from "@/components/ui/button";

export default function AskQuestionPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    title: "",
    body: "",
  });
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors = {
      title: "",
      body: "",
    };
    let isValid = true;

    if (!questionTitle.trim()) {
      newErrors.title = t("createQuestion.errors.titleRequired");
      isValid = false;
    } else if (questionTitle.trim().length < 15) {
      newErrors.title = t("createQuestion.errors.titleMinLength", {
        length: 15,
      });
      isValid = false;
    }

    if (!questionBody.trim()) {
      newErrors.body = t("createQuestion.errors.bodyRequired");
      isValid = false;
    } else if (questionBody.trim().length < 30) {
      newErrors.body = t("createQuestion.errors.bodyMinLength", { length: 30 });
      isValid = false;
    }

    setValidationErrors(newErrors);
    setApiError(null);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    const questionData: QuestionCreateRequest = {
      title: questionTitle.trim(),
      content: questionBody.trim(),
    };

    try {
      const response = await createQuestion(questionData);

      if (response && response.data) {
        router.push("/questions");
      }
    } catch (err: any) {
      console.error("Error submitting question:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        t("createQuestion.errors.apiError");
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/questions"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t("createQuestion.backLink")}
        </Link>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">
          {t("createQuestion.pageTitle")}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="title"
            >
              {t("createQuestion.titleLabel")}
            </label>
            <input
              id="title"
              type="text"
              className={`w-full rounded-md border ${
                validationErrors.title ? "border-red-500" : "border-gray-300"
              } p-3 focus:border-blue-500 focus:outline-none`}
              placeholder={t("createQuestion.titlePlaceholder")}
              value={questionTitle}
              onChange={(e) => {
                setQuestionTitle(e.target.value);
                if (validationErrors.title)
                  setValidationErrors((prev) => ({ ...prev, title: "" }));
              }}
              disabled={isSubmitting}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.title}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {}
              {t("createQuestion.titleHelpText")}
            </p>
          </div>

          <div className="mb-6">
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="details"
            >
              {t("createQuestion.bodyLabel")}
            </label>
            <textarea
              id="details"
              className={`w-full rounded-md border ${
                validationErrors.body ? "border-red-500" : "border-gray-300"
              } p-3 focus:border-blue-500 focus:outline-none`}
              rows={8}
              placeholder={t("createQuestion.bodyPlaceholder")}
              value={questionBody}
              onChange={(e) => {
                setQuestionBody(e.target.value);
                if (validationErrors.body)
                  setValidationErrors((prev) => ({ ...prev, body: "" }));
              }}
              disabled={isSubmitting}
            ></textarea>
            {validationErrors.body && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.body}
              </p>
            )}
          </div>

          {apiError && (
            <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
              {apiError}
            </div>
          )}

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting
                ? t("createQuestion.submittingButton")
                : t("createQuestion.submitButton")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
