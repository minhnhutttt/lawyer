'use client'

import LawyersBanner from "./components/LawyersBanner"
import LawyersSidebar from "./components/LawyersSidebar"
import LawyersIntroduction from "./components/LawyersIntroduction"
import LawyersField from "./components/LawyersField"
import LawyersCards from "./components/LawyersCards"
import LawyersResolved from "./components/LawyersResolved"
import LawyersSearch from "./components/LawyersSearch"
import LawyersInformation from "./components/LawyersInformation"

export default function LawyersPage() {
  return (
    <main className="w-full">
      <LawyersBanner />

      <div className="w-full max-w-[1104px] mx-auto py-8">
        <div className="grid gap-12 md:grid-cols-[352px_calc(100%-400px)]">
          <LawyersSidebar />
          <div className="flex flex-col gap-8">
            <LawyersIntroduction />
            <LawyersCards />
            <LawyersField />
            <LawyersResolved />
            <LawyersSearch />
            <LawyersInformation />
          </div>
        </div>
      </div>
    </main>
  )
}
