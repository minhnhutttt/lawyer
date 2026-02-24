import Breadcrumb from "@/components/common/Breadcrumb";
import EstimateMainvisual from "./components/EstimateMainvisual";
import EstimateQuotation from "./components/EstimateQuotation";
import EstimateStep from "./components/EstimateStep";
import EstimateFaq from "./components/EstimateFaq";

export default function Estimate() {

  return (
    <main className="">
      <Breadcrumb items={[{ label: '一括見積り' }]} className="mb-0" />
      <EstimateMainvisual />
      <EstimateQuotation />
      <EstimateStep />
      <EstimateFaq />
      <EstimateQuotation type={2} className="mb-[60px]" />
    </main>
  )
}
