import Container from "@/components/layout/Container";
import Breadcrumb from "@/components/common/Breadcrumb";
import Sidebar from "./components/ContactSidebar";
import ContactTitle from "./components/ContactTitle";
import ContactFaq from "./components/ContactFaq";
import ContactOfficeHours from "./components/ContactOfficeHours";
import ContactForm from "./components/ContactForm";

export default function Contact() {
  const faqs = [
    { question: '投稿した内容を編集や削除することはできますか', href: '/faq/1' },
    { question: '投稿に追加で書き込みをしたいです', href: '/faq/2' },
  ]

  return (
    <main className="">
      <Breadcrumb items={[{ label: 'お問い合わせ' }]} />
      <div className="mb-12">
        <Container sidebar={<Sidebar />}>
          <ContactTitle variant={1} className="mb-[30px]">お問い合わせ</ContactTitle>
          <ContactFaq faqs={faqs} />
          <ContactOfficeHours />
          <ContactForm />
        </Container>
      </div>
    </main>
  )
}
