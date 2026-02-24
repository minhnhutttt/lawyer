import ExpandableSection from "@/components/common/ExpandableSection";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LawyersInformation() {
    return (
        <div>
            <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec]">埼玉の弁護士の関連情報</h3>
            <div className="relative md:pt-7 pt-5 md:pb-9 pb-7 flex flex-col gap-6 md:px-8 px-6">
                <div className="flex flex-col gap-3">
                    <div className="md:text-[16px] text-[14px] font-bold">法テラスとは？</div>
                    <p className="md:text-[14px] text-[12px]">法テラスとは、法律トラブルを抱えた人が気軽に利用できる公的なサービスです。気軽に無料で法律に関する情報提供を受けられ、役立つ法制度や適切な窓口を紹介してくれます。</p>
                    <p className="md:text-[14px] text-[12px]">経済的に余裕のない人も一定の条件を満たせば、無料で法律相談をしたり費用を立て替えてもらったりすることができます。弁護士や司法書士などの専門家に依頼しやすい環境を整えているのです。</p>
                    <Link href="#" className="relative rounded-md max-w-[340px] w-full min-h-[88px] bg-white flex gap-3 border border-[#ededed] p-4 pl-[106px] mx-auto after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-4">

                        <Image src="/images/lawyers/what-is-houterasu.png" alt="" width={132} height={132} className="absolute w-[88px] left-0 top-0" />
                        <span className="md:text-[14px] text-[12px] font-bold">
                            弁護士に無料相談ができる？<br />法テラスとは
                        </span>
                    </Link>
                </div>
                <ExpandableSection collapsedHeight={90}>
                    <div className="flex flex-col gap-3 md:text-[14px] text-[12px]">
                        <p className="py-1 pl-3 border-l-[6px] border-[#bebdbd] font-bold">埼玉県の利用可能な法テラス</p>
                        <p>
                            経済的に余裕がない場合には法テラスの活用がおすすめです。埼玉県にはさいたま市・川越市・熊谷市・秩父市に法テラスがあります。高齢者や障害のある方、相談場所から遠方に住む方には出張相談も可能です。法テラスで無料相談を受けるには収入や資産が基準額以下という条件があるのでご留意ください。
                        </p>
                        <ul>
                            <li className="p-4 border border-[#ededed]">
                                <span className="flex flex-col gap-1.5">
                                    <span className="md:text-[12px] text-[10px] font-bold">法テラス埼玉</span>
                                    <span className="md:text-[12px] text-[10px] grid grid-cols-[max-content_1fr] gap-1.5">
                                        <span className="text-[#72706e]">所在地</span>
                                        <span>埼玉県さいたま市浦和区高砂3-17-15 さいたま商工会議所会館6F</span>
                                        <span className="text-[#72706e]">電話番号</span>
                                        <span>0570-078312</span>
                                    </span>
                                </span>
                            </li>
                            <li className="p-4 border border-[#ededed]">
                                <span className="flex flex-col gap-1.5">
                                    <span className="md:text-[12px] text-[10px] font-bold">法テラス川越</span>
                                    <span className="md:text-[12px] text-[10px] grid grid-cols-[max-content_1fr] gap-1.5">
                                        <span className="text-[#72706e]">所在地</span>
                                        <span>埼玉県川越市脇田本町10-10 KJビル3F</span>
                                        <span className="text-[#72706e]">電話番号</span>
                                        <span>0570-078313</span>
                                    </span>
                                </span>
                            </li>
                            <li className="p-4 border border-[#ededed]">
                                <span className="flex flex-col gap-1.5">
                                    <span className="md:text-[12px] text-[10px] font-bold">法テラス熊谷法律事務所</span>
                                    <span className="md:text-[12px] text-[10px] grid grid-cols-[max-content_1fr] gap-1.5">
                                        <span className="text-[#72706e]">所在地</span>
                                        <span>埼玉県熊谷市筑波3-195 熊谷駅前ビル7階</span>
                                        <span className="text-[#72706e]">電話番号</span>
                                        <span>050-3383-5380</span>
                                    </span>
                                </span>
                            </li>
                            <li className="p-4 border border-[#ededed]">
                                <span className="flex flex-col gap-1.5">
                                    <span className="md:text-[12px] text-[10px] font-bold">法テラス秩父法律事務所</span>
                                    <span className="md:text-[12px] text-[10px] grid grid-cols-[max-content_1fr] gap-1.5">
                                        <span className="text-[#72706e]">所在地</span>
                                        <span>埼玉県秩父市番場町11-1 サンウッド東和2階</span>
                                        <span className="text-[#72706e]">電話番号</span>
                                        <span>050-3383-0023</span>
                                    </span>
                                </span>
                            </li>
                        </ul>
                        <div className="flex justify-end">
                            <Link href="#" className="text-[#72706e] text-[11px] underline">参考：日本司法支援センター法テラス</Link>
                        </div>
                    </div>
                </ExpandableSection>
                <div className="flex flex-col gap-3">
                    <div className="md:text-[16px] text-[14px] font-bold">埼玉県の弁護士会</div>
                    <p className="md:text-[14px] text-[12px]">埼玉弁護士会は、2024年4月1日時点で980名の弁護士が所属しており、さいたま市浦和区で法律相談センターを運営しています。また、大宮そごうデパートにも法律相談コーナーを設けています。法律相談の実施日や相談料は各相談場所により異なります。法律相談には事前に電話またはネットでの予約が必要です。</p>
                </div>
                <ExpandableSection collapsedHeight={90}>
                    <div className="flex flex-col gap-3 md:text-[14px] text-[12px]">
                        <p className="py-1 pl-3 border-l-[6px] border-[#bebdbd] font-bold">埼玉県の弁護士会の相談センター</p>
                        <ul>
                            <li className="p-4 border border-[#ededed]">
                                <span className="flex flex-col gap-1.5">
                                    <span className="md:text-[12px] text-[10px] font-bold">埼玉弁護士会法律相談センター（浦和）</span>
                                    <span className="md:text-[12px] text-[10px] grid grid-cols-[max-content_1fr] gap-1.5">
                                        <span className="text-[#72706e]">所在地</span>
                                        <span>埼玉県さいたま市浦和区高砂4-2-1 浦和高砂パークハウス1階</span>
                                        <span className="text-[#72706e]">電話番号</span>
                                        <span>048-710-5666</span>
                                    </span>
                                </span>
                            </li>
                            <li className="p-4 border border-[#ededed]">
                                <span className="flex flex-col gap-1.5">
                                    <span className="md:text-[12px] text-[10px] font-bold">埼玉弁護士会相談センター（川越支部）</span>
                                    <span className="md:text-[12px] text-[10px] grid grid-cols-[max-content_1fr] gap-1.5">
                                        <span className="text-[#72706e]">所在地</span>
                                        <span>埼玉県川越市宮下町2-1-2 福田ビル1階</span>
                                        <span className="text-[#72706e]">電話番号</span>
                                        <span>049-225-4297</span>
                                    </span>
                                </span>
                            </li>
                            <li className="p-4 border border-[#ededed]">
                                <span className="flex flex-col gap-1.5">
                                    <span className="md:text-[12px] text-[10px] font-bold">埼玉弁護士会法律相談センター（熊谷支部）</span>
                                    <span className="md:text-[12px] text-[10px] grid grid-cols-[max-content_1fr] gap-1.5">
                                        <span className="text-[#72706e]">所在地</span>
                                        <span>埼玉県熊谷市宮町1-41 宮町ビル 埼玉弁護士会熊谷支部会館</span>
                                        <span className="text-[#72706e]">電話番号</span>
                                        <span>048-521-0844</span>
                                    </span>
                                </span>
                            </li>
                            <li className="p-4 border border-[#ededed]">
                                <span className="flex flex-col gap-1.5">
                                    <span className="md:text-[12px] text-[10px] font-bold">埼玉弁護士会秩父法律相談センター</span>
                                    <span className="md:text-[12px] text-[10px] grid grid-cols-[max-content_1fr] gap-1.5">
                                        <span className="text-[#72706e]">所在地</span>
                                        <span>埼玉県秩父市宮側町1-7 秩父地域地場産業振興センター</span>
                                        <span className="text-[#72706e]">電話番号</span>
                                        <span>048-521-0844</span>
                                    </span>
                                </span>
                            </li>
                            <li className="p-4 border border-[#ededed]">
                                <span className="flex flex-col gap-1.5">
                                    <span className="md:text-[12px] text-[10px] font-bold">埼玉弁護士会法律相談センター（越谷支部）</span>
                                    <span className="md:text-[12px] text-[10px] grid grid-cols-[max-content_1fr] gap-1.5">
                                        <span className="text-[#72706e]">所在地</span>
                                        <span>埼玉県越谷市東越谷9-7-19 システムビル東越谷2階</span>
                                        <span className="text-[#72706e]">電話番号</span>
                                        <span>048-962-1188</span>
                                    </span>
                                </span>
                            </li>
                        </ul>
                        <div className="flex justify-end">
                            <Link href="#" className="text-[#72706e] text-[11px] underline">参考：埼玉弁護士会が提供する法律相談センター</Link>
                        </div>
                    </div>
                </ExpandableSection>
                <div className="py-6 md:text-[16px] text-[14px] text-[#72706e]">
                    <p className=" font-bold">* 認知度調査No.1概要</p>
                    <ul className="px-6 list-disc">
                        <li>
                            <span className="font-bold mr-2 after:content-[':'] after:font-normal">調査手法</span>
                            <span>インターネット調査</span>
                        </li>
                        <li>
                            <span className="font-bold mr-2 after:content-[':'] after:font-normal">調査時期</span>
                            <span>2023年12月14日～18日</span>
                        </li>
                        <li>
                            <span className="font-bold mr-2 after:content-[':'] after:font-normal">調査機関</span>
                            <span>外部ネットリサーチ会社</span>
                        </li>
                        <li>
                            <span className="font-bold mr-2 after:content-[':'] after:font-normal">調査対象者</span>
                            <span>外部ネットリサーチ会社登録のアンケートモニター</span>
                        </li>
                        <li>
                            <span className="font-bold mr-2 after:content-[':'] after:font-normal">調査サンプル</span>
                            <span>1,030名</span>
                        </li>
                        <li>
                            <span className="font-bold mr-2 after:content-[':'] after:font-normal">調査項目</span>
                            <span>当社サービス含む法律関連サービス（25サービス）の認知</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
} 