'use client'

import Navigation from "./components/Navigation";
import Search from "./components/Search";
import Areas from "./components/Areas";
import Solutions from "./components/Solutions";
import Banners from "./components/Banners";
import Lawyers from "./components/Lawyers";
import QA from "./components/Qa";
import News from "./components/News";
import Sidebar from "./components/sidebar/Sidebar";
import Container from "@/components/layout/Container";


export default function Home() {
  
  return (
    <main className="">
      <Navigation />
        <Container sidebar={<><Sidebar /></>}>
            <Search />
            <Areas />
            <Solutions />
            <Banners />
            <Lawyers />
            <QA />
            <News />
        </Container>
    </main>
  )
}
