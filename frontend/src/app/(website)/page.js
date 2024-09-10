"use client";
import HeroForm from "@/components/forms/HeroForm";
import Header from "@/components/Header";
import useAuth from "@/hooks/useAuth";

export default function Home() {
  const { isloggedIn } = useAuth();
  return (
    <main>
      <Header />
      <section className="mx-10 md:mx-20 pt-32">
        <div className="max-w-md mb-8">
          <h1 className="text-6xl font-bold">
            Your one link
            <br />
            for everything
          </h1>

          <h2 className="text-gray-500 text-xl mt-6">
            Share your links, social profiles, contact info and more on one page
          </h2>
        </div>
        {!isloggedIn && <HeroForm />}
      </section>
    </main>
  );
}
