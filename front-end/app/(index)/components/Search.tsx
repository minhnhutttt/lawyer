import ButtonLink from "@/components/common/ButtonLink";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Search() {
  const [tab, setTab] = useState(0)
  return (
    <div className="bg-[#ece4da] mb-[15px] p-1.5">
      <div className="flex items-start justify-between max-md:gap-2">
        <button onClick={() => setTab(0)}
          className={cn(
            'rounded-[5px] text-[15px] bg-white w-1/2 md:w-[240px] [box-shadow:inset_-1px_-1px_#d8d8d8,_inset_0_0_0_1px_#e9e9e9,_inset_2px_2px_#fff]  flex items-center justify-center gap-1 top-px relative',
            tab === 0 ? 'border-b-none rounded-tl-[5px] rounded-br-none rounded-tr-[5px] rounded-bl-none [box-shadow:0_0_0_#fff,_inset_1px_0_0_#ddd,_inset_0_1px_0_#ddd,_inset_-1px_0_0_#ddd] text-[#74542b] py-4 md:py-3' : 'py-3 md:py-2 bg-[linear-gradient(#fdfdfd,_#f8f8f8)]'
          )}>
            <span className="flex items-center gap-1 max-md:h-20">
          <Image
            src="/images/icn-lawyer_middle.webp"
            alt=""
            width={22}
            height={22}
          />
          <strong>弁護士</strong>を探す
          </span>
        </button>
        <button onClick={() => setTab(1)}
          className={cn(
            'rounded-[5px] text-[15px] bg-white w-1/2 md:w-[374px] max-md:flex-col [box-shadow:inset_-1px_-1px_#d8d8d8,_inset_0_0_0_1px_#e9e9e9,_inset_2px_2px_#fff] flex items-center justify-center gap-1 top-px max-md:gap-3 relative ',
            tab === 1 ? 'border-b-none rounded-tl-[5px] rounded-br-none rounded-tr-[5px] rounded-bl-none [box-shadow:0_0_0_#fff,_inset_1px_0_0_#ddd,_inset_0_1px_0_#ddd,_inset_-1px_0_0_#ddd] text-[#74542b] py-4 md:py-3' : 'py-3 md:py-2 bg-[linear-gradient(#fdfdfd,_#f8f8f8)]'
          )}>
            <div className="flex items-center max-md:flex-col max-md:gap-2 max-md:h-20">
            <span className="flex items-center gap-1">
          <Image
            src="/images/icn-bbs_middle.webp"
            alt=""
            width={22}
            height={22}
          />

          <strong>法律Q&A</strong>を探す
          </span>

          <span className="bg-[#fff] border-[1px] border-[solid] border-[#ddd] rounded-[3px] inline-block text-[.7em] leading-[1.2] ml-[8px] mr-[5px] -my-[4px] relative text-center align-middle">
            <span className="border-r-[1px_solid_#eee] text-[#74542b] block md:float-left px-[5px] py-[9px] text-[9px] leading-[1.2] text-center">直近30日</span>
            <span className="block md:float-right pt-[3px] px-[5px] pb-[0] text-left [box-shadow:0_0_0_#f0f0f0,_inset_0_1px_2px_hsla(0,_0%,_39%,_.3)] text-[#999] bg-[linear-gradient(#eee,_#e3e3e3)]">
              <span className="text-[#74542b]">相談数</span>
              <span className="float-right ml-1">
                <span className="">4,302</span>件
              </span>
              <br />
              <span className="text-[#74542b]">弁護士回答数</span>
              <span className="float-right ml-1">
                <span className="text-[#f90]">8,926</span>件
              </span>
            </span>
          </span>
          </div>
        </button>
      </div>
      <div className="bg-white border border-[#e4d8cb] p-[13px]">
            <form action="" className={cn(tab == 0 ? 'block' : 'hidden')}>
              <div className="flex justify-between items-center max-md:flex-col">
                <div className="flex items-center gap-3 md:gap-1 max-md:flex-col">
                  <div className="flex max-md:w-full">
                    <p className="size-[38px] text-[11px] text-[#74542b] font-bold bg-white border border-[#ddd] flex items-center justify-center">地域</p>
                    <div className="relative flex items-center after:absolute after:right-2 after:bg-[url(/images/icon_arrow_downS.png)] after:bg-cover after:w-[7px] after:h-[5px]">
                      <select name="" id="" className="overflow-hidden rounded-[3px] appearance-none w-[200px] md:w-[120px] flex items-center h-[38px] [box-shadow:inset_-1px_-1px_#d8d8d8,_inset_0_0_0_1px_#e9e9e9,_inset_2px_2px_#fff] bg-[linear-gradient(#fdfdfd,_#f8f8f8)] text-[13px] relative  text-center">
                        <option value="">全国</option>
                        <option value="hokkaido">北海道</option>
                        <option value="aomori">青森県</option>
                        <option value="iwate">岩手県</option>
                        <option value="miyagi">宮城県</option>
                      </select>
                    </div>
                  </div>

                  <Image
                    src="/images/icn-mix.png"
                    alt=""
                    width={12}
                    height={12}
                  />
                  <div className="flex max-md:w-full">
                    <p className="size-[38px] text-[11px] text-[#74542b] font-bold bg-white border border-[#ddd] flex items-center justify-center">分野</p>
                    <div className="relative flex items-center after:absolute after:right-2 after:bg-[url(/images/icon_arrow_downS.png)] after:bg-cover after:w-[7px] after:h-[5px]">
                      <select name="" id="" className="overflow-hidden rounded-[3px] appearance-none w-[200px] md:w-[160px] flex items-center h-[38px] [box-shadow:inset_-1px_-1px_#d8d8d8,_inset_0_0_0_1px_#e9e9e9,_inset_2px_2px_#fff] bg-[linear-gradient(#fdfdfd,_#f8f8f8)] text-[13px] relative  text-center">
                        <option value="">指定しない</option>
                        <option value="1">借金・債務整理</option>
                        <option value="2">交通事故</option>
                        <option value="3">離婚・男女問題</option>
                        <option value="4">遺産相続</option>
                        <option value="5">労働問題</option>
                        <option value="6">債権回収</option>
                        <option value="7">医療問題</option>
                        <option value="8">詐欺被害・消費者被害</option>
                        <option value="9">国際・外国人問題</option>
                        <option value="10">インターネット問題</option>
                        <option value="11">犯罪・刑事事件</option>
                        <option value="12">不動産・建築</option>
                        <option value="13">企業法務・顧問弁護士</option>
                        <option value="14">税務訴訟・行政事件</option>
                      </select>
                    </div>
                  </div>
                  <div className="">
                    <button className="flex max-md:w-[236px] items-center justify-center p-3 text-sm leading-none text-white bg-[linear-gradient(#ffa113,_#ff8e08)] rounded-[3px]">
                      検索
                    </button>
                  </div>
                </div>
                <div className="max-md:mt-2">
                  <ButtonLink link="/search">弁護士詳細検索</ButtonLink>
                </div>
              </div>
            </form>
            <form action=""  className={cn(tab == 1 ? 'block' : 'hidden')}>
              <div className="flex justify-between items-center max-md:flex-col">
                <div className="flex items-center gap-3 md:gap-1">
                  <input type="text" placeholder="キーワードを入力" className="w-[240px] md:w-[350px] py-2 px-2.5 bg-[#f8f8f8] border border-[#ddd] text-sm [box-shadow:inset_2px_2px_3px_0_#eee]" />
                  <button className="flex items-center justify-center p-3 text-sm leading-none text-white bg-[linear-gradient(#ffa113,_#ff8e08)] rounded-[3px]">
                    検索
                  </button>
                </div>
                <div className="max-md:mt-2">
                  <ButtonLink link="/bbs">法律相談トップ</ButtonLink>
                </div>
              </div>
              <div className="flex text-[13px] mt-1.5">
                <p className="">例: </p>
                <div className="flex text-[#005ebb] gap-1 flex-wrap">
                  <Link href="/"> 離婚 相談</Link>
                  <Link href="/"> 不倫 慰謝料</Link>
                  <Link href="/"> ワンクリック詐欺</Link>
                  <Link href="/"> 残業代 請求</Link>
                </div>
              </div>
            </form>
      </div>
    </div>
  )
} 