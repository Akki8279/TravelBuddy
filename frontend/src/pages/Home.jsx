import React from "react";
import { Link } from "react-router-dom";
import a from "../assets/a.jpg";
import b from "../assets/b.jpg";
import c from "../assets/c.jpg";
import d from "../assets/d.jpg";

function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">

      <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-wide">
          Travel Buddy
        </h1>

        <div className="hidden sm:flex gap-6">
          <Link to="/login" className="border px-5 py-2 rounded-xl font-semibold hover:scale-105 transition">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white text-gray-900 px-5 py-2 rounded-xl font-semibold hover:scale-105 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">

        {/* Text */}
        <div>
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Your perfect{" "}
            <span className="bg-linear-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Travel Buddy
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-300 max-w-xl">
            Discover destinations, plan trips, and travel smarter with a companion
            that understands your journey.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 text-gray-900 font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="border border-white/30 px-8 py-4 rounded-2xl hover:bg-white/10 transition"
            >
              Log In
            </Link>
          </div>
        </div>

        <div className="w-full h-80 border border-white/20 rounded-3xl flex items-center justify-center text-gray-400">
            <img src={a} alt="img1" className="rounded-3xl" />
        </div>

      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 space-y-24 flex flex-col gap-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="w-full h-72 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center text-gray-400">
            <img src={b} alt="img"  className="rounded-3xl"/>
          </div>

          <div>
            <h3 className="text-3xl font-bold mb-4">
              Plan trips effortlessly
            </h3>
            <p className="text-gray-300 text-lg">
              Create itineraries, manage schedules, and organize everything
              in one place without stress.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="lg:order-2 w-full h-72 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center text-gray-400">
          <img src={c} alt="img"  className="rounded-3xl"/>
          </div>

          <div className="lg:order-1">
            <h3 className="text-3xl font-bold mb-4">
              Discover new destinations
            </h3>
            <p className="text-gray-300 text-lg">
              Get personalized recommendations based on your interests
              and travel history.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols2 lg:grid-cols-2 gap-16 items-center">
          <div className="w-full h-72 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center text-gray-400">
          <img src={d} alt="img"  className="rounded-3xl"/>
          </div>

          <div>
            <h3 className="text-3xl font-bold mb-4">
              Travel with confidence
            </h3>
            <p className="text-gray-300 text-lg">
              Stay informed with tips, guides, and real-time insights
              wherever you go.
            </p>
          </div>
        </div>

      </section>

      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl">
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">
            Start your next journey today
          </h3>
          <p className="text-gray-300 text-lg mb-8">
            Join Travel Buddy and turn your travel plans into unforgettable experiences.
          </p>

          <Link
            to="/register"
            className="inline-block bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 text-gray-900 font-bold px-10 py-4 rounded-2xl shadow-xl hover:scale-105 transition"
          >
            Join Now
          </Link>
        </div>
      </section>

      <footer className="text-center text-gray-400 py-8 text-sm">
        © {new Date().getFullYear()} Travel Buddy. All rights reserved.
      </footer>

    </div>
  );
}

export default Home;
