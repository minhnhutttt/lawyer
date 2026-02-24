import { ReactNode } from "react"

export const QuestionsAnswer = ({question, answer}: {question: string, answer: ReactNode}) => {
  return (
    <div className="bg-[#fbf9f8] border border-[#ededed] rounded-lg p-5 md:text-[14px] text-[12px]">
      <p className="mb-2"><span className="font-bold">Q.</span>{question}</p>
      <p><span className="font-bold">A.</span>{answer}</p>
    </div>
  )
}
