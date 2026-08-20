import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import {
  Leaf,
  Trash2,
  HeartCrack,
  Link2Off,
  MapPin,
  ShieldCheck,
  Eye,
  BarChart,
  Smartphone,
  Users,
  CheckCircle,
  ArrowRight,
  Utensils,
  HandHeart,
  Truck,
  Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function LandingPage({ onGetStarted }) {
  const [stats, setStats] = useState({
    meals: 0,
    ngos: 0,
    cities: 0
  })

  useEffect(() => {
    async function loadStats() {
      const [{ count: meals }, { data: profiles }] = await Promise.all([
        supabase
          .from('donations')
          .select('*', { count: 'exact', head: true }),

        supabase
          .from('profiles')
          .select('role, city'),
      ])

      const ngos = (profiles || []).filter(
        p => p.role === 'ngo'
      ).length

      const cities = new Set(
        (profiles || [])
          .map(p => p.city)
          .filter(Boolean)
      ).size

      setStats({
        meals: meals || 0,
        ngos,
        cities
      })
    }

    loadStats()
  }, [])

  return (
    <div className="pt-16">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        id="home"
        className="min-h-screen flex items-center text-white hero-gradient relative overflow-hidden"
      >

        {/* Background Decorations */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-400/20 rounded-full blur-3xl" />

          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />

          <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl" />

          <div className="absolute top-32 left-[12%] w-3 h-3 bg-white/30 rounded-full animate-pulse" />

          <div className="absolute top-[25%] right-[15%] w-2 h-2 bg-green-300/50 rounded-full animate-pulse" />

          <div className="absolute bottom-[20%] left-[20%] w-2 h-2 bg-white/30 rounded-full animate-pulse" />

          <div className="absolute bottom-[30%] right-[10%] w-3 h-3 bg-green-300/30 rounded-full animate-pulse" />

        </div>


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full relative z-10">

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">


            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="text-center lg:text-left">

              {/* Header Badge */}

              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 reveal">

                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />

                <span className="text-sm font-medium text-white/90">
                  Fighting food waste. Feeding communities.
                </span>

              </div>


              {/* Main Heading */}

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 reveal">

                Welcome to

                <span className="block text-green-300">
                  Feed Ferry
                </span>

              </h1>


              {/* Subtitle */}

              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-xl mx-auto lg:mx-0 reveal delay-1">
                Turning surplus food into meaningful support for communities.
              </p>


              {/* Small Description */}

              <p className="text-base text-white/70 max-w-lg mx-auto lg:mx-0 mb-10 reveal delay-1">
                Feed Ferry connects food donors with verified NGOs so that
                good food reaches people instead of going to waste.
              </p>


              {/* Buttons */}

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 reveal delay-2">

                <button
                  onClick={onGetStarted}
                  className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all shadow-lg hover:scale-105"
                >
                  Get Started
                </button>

                <a
                  href="#about"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all"
                >
                  Learn More
                </a>

              </div>


              {/* Stats */}

              <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-lg mx-auto lg:mx-0 reveal delay-3">

                {[
                  {
                    val: stats.meals,
                    label: 'Meals Donated'
                  },
                  {
                    val: stats.ngos,
                    label: 'Active NGOs'
                  },
                  {
                    val: stats.cities,
                    label: 'Cities Covered'
                  },
                ].map(s => (

                  <div
                    key={s.label}
                    className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl py-4 px-2 hover:bg-white/15 transition-all"
                  >

                    <h3 className="text-3xl md:text-4xl font-bold">
                      {s.val}
                    </h3>

                    <p className="text-xs md:text-sm opacity-80">
                      {s.label}
                    </p>

                  </div>

                ))}

              </div>


              {/* Impact Badge */}

              <div className="mt-8 flex justify-center lg:justify-start reveal delay-3">

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 shadow-2xl">

                  <div className="flex items-center gap-4">

                    <div className="relative flex-shrink-0">

                      <div className="absolute inset-0 bg-green-300 rounded-full blur-md opacity-40 animate-pulse" />

                      <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">

                        <Leaf
                          size={25}
                          className="text-green-600"
                        />

                      </div>

                    </div>

                    <div className="text-left">

                      <div className="flex items-center gap-2">

                        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />

                        <span className="text-xs uppercase tracking-wider font-semibold text-green-100">
                          Making an Impact
                        </span>

                      </div>

                      <p className="text-base sm:text-lg font-bold text-white">
                        Every meal deserves a second chance.
                      </p>

                      <p className="text-sm text-white/70">
                        Together, we can turn surplus into support.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                RIGHT SIDE HERO VISUAL
            ================================================= */}

            <div className="relative hidden md:block h-[560px]">


              {/* Main Circular Background */}

              <div className="absolute inset-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm" />

              <div className="absolute inset-20 rounded-full bg-gradient-to-br from-green-300/10 to-purple-300/10 border border-white/10" />


              {/* Decorative Circles */}

              <div className="absolute top-5 right-20 w-16 h-16 border border-green-300/30 rounded-full" />

              <div className="absolute bottom-8 left-20 w-10 h-10 border border-white/20 rounded-full" />


              {/* =================================================
                  NEW LEFT VISUAL CARD
              ================================================= */}

              <div className="absolute top-16 -left-8 bg-white/95 text-gray-800 rounded-3xl shadow-2xl p-5 w-60 hover:-translate-y-2 transition-transform duration-300 z-20">

                <div className="flex items-center justify-between mb-4">

                  <div>

                    <p className="text-xs text-gray-400">
                      Food Journey
                    </p>

                    <p className="font-bold text-lg">
                      From Surplus
                    </p>

                  </div>

                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Utensils
                      size={21}
                      className="text-orange-500"
                    />
                  </div>

                </div>


                <div className="space-y-3">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                      🍛
                    </div>

                    <div className="flex-1">

                      <p className="text-xs text-gray-400">
                        Donor
                      </p>

                      <p className="text-sm font-semibold">
                        Surplus Food
                      </p>

                    </div>

                  </div>


                  <div className="flex justify-center">

                    <ArrowRight
                      size={18}
                      className="text-green-500 rotate-90"
                    />

                  </div>


                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                      <HandHeart
                        size={19}
                        className="text-green-600"
                      />
                    </div>

                    <div className="flex-1">

                      <p className="text-xs text-gray-400">
                        Feed Ferry
                      </p>

                      <p className="text-sm font-semibold">
                        Smart Matching
                      </p>

                    </div>

                  </div>


                  <div className="flex justify-center">

                    <ArrowRight
                      size={18}
                      className="text-green-500 rotate-90"
                    />

                  </div>


                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                      🤝
                    </div>

                    <div className="flex-1">

                      <p className="text-xs text-gray-400">
                        Community
                      </p>

                      <p className="text-sm font-semibold">
                        People in Need
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  CENTRAL FOOD CARD
              ================================================= */}

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">

                <div className="relative w-52 h-52 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">

                  <div className="absolute inset-3 rounded-[2.5rem] bg-gradient-to-br from-green-50 to-emerald-100" />

                  <div className="relative text-8xl">
                    🍱
                  </div>


                  <div className="absolute -top-5 -right-5 w-14 h-14 bg-green-500 rounded-2xl shadow-xl flex items-center justify-center rotate-12">

                    <Leaf
                      size={28}
                      className="text-white"
                    />

                  </div>

                </div>

              </div>


              {/* =================================================
                  DONATION CARD
              ================================================= */}

              <div className="absolute top-8 right-0 bg-white text-gray-800 rounded-2xl shadow-2xl p-4 w-64 hover:-translate-y-2 transition-transform duration-300">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                    🍛
                  </div>

                  <div>

                    <p className="text-xs text-gray-400">
                      New Donation
                    </p>

                    <p className="font-bold">
                      25 Meals Available
                    </p>

                  </div>

                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-green-600 font-medium">

                  <CheckCircle size={15} />

                  Ready for pickup

                </div>

              </div>


              {/* =================================================
                  NGO CARD
              ================================================= */}

              <div className="absolute bottom-8 right-0 bg-white text-gray-800 rounded-2xl shadow-2xl p-4 w-64 hover:-translate-y-2 transition-transform duration-300">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">

                    <Users
                      size={22}
                      className="text-green-600"
                    />

                  </div>

                  <div>

                    <p className="text-xs text-gray-400">
                      Matched NGO
                    </p>

                    <p className="font-bold">
                      Nearby Organization
                    </p>

                  </div>

                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-green-600">

                  <MapPin size={15} />

                  2.4 km away

                </div>

              </div>


              {/* =================================================
                  IMPACT CARD
              ================================================= */}

              <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-white/95 backdrop-blur text-gray-800 rounded-2xl shadow-2xl p-4 w-48 hover:scale-105 transition-transform duration-300">

                <div className="flex items-center gap-2 mb-2">

                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">

                    <Leaf
                      size={19}
                      className="text-green-600"
                    />

                  </div>

                  <span className="text-xs font-semibold text-gray-500">
                    Your Impact
                  </span>

                </div>

                <p className="text-2xl font-bold text-gray-800">
                  Less Waste
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  More meals reaching people.
                </p>

              </div>


              {/* Connecting Route */}

              <div className="absolute top-[40%] left-[25%] w-44 border-t-2 border-dashed border-green-300/50 rotate-[-20deg]" />

              <div className="absolute top-[39%] left-[23%] w-3 h-3 bg-green-300 rounded-full" />

              <div className="absolute top-[29%] right-[28%] w-3 h-3 bg-white rounded-full" />


              {/* Floating Food */}

              <div className="absolute top-1/2 left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-3xl rotate-[-12deg] hover:rotate-0 transition-transform">
                🥗
              </div>

              <div className="absolute bottom-20 left-28 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-3xl rotate-12 hover:rotate-0 transition-transform">
                🍎
              </div>

              <div className="absolute top-20 right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-3xl rotate-6 hover:rotate-0 transition-transform">
                🥖
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROBLEM
      ===================================================== */}

      <section className="py-20 bg-gray-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl mx-auto text-center mb-12">

            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">

              <HeartCrack size={16} />

              The Challenge

            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              The Problem We Solve
            </h2>

            <p className="text-gray-500">
              Good food is often wasted while people nearby need support.
              Feed Ferry helps close that gap.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-6">

            {[
              {
                Icon: Trash2,
                title: 'Food Waste',
                desc: 'Large amounts of safe, usable food are thrown away every day.',
                color: 'text-red-500',
                bg: 'bg-red-50'
              },
              {
                Icon: HeartCrack,
                title: 'Food Insecurity',
                desc: 'Many people and communities still struggle to access enough food.',
                color: 'text-orange-500',
                bg: 'bg-orange-50'
              },
              {
                Icon: Link2Off,
                title: 'Disconnected Resources',
                desc: 'Donors and organizations often lack a simple way to connect.',
                color: 'text-yellow-500',
                bg: 'bg-yellow-50'
              },
            ].map(({ Icon, title, desc, color, bg }) => (

              <div
                key={title}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 reveal"
              >

                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-5`}>

                  <Icon
                    size={25}
                    className={color}
                  />

                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {title}
                </h3>

                <p className="text-gray-500 leading-relaxed">
                  {desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section id="about" className="py-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-3xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">

              <Leaf size={16} />

              About Feed Ferry

            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Technology with a Purpose
            </h2>

            <p className="text-lg text-gray-600 mb-4">
              Feed Ferry connects restaurants, hotels, events, and individuals
              with verified NGOs so surplus food can reach people who need it.
            </p>

            <p className="text-lg text-gray-600 mb-10">
              Our goal is simple: reduce food waste and make community support
              easier through technology.
            </p>


            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {[
                'GPS Matching',
                'Verified NGOs',
                'Real-time Tracking',
                'Community Support'
              ].map(feat => (

                <div
                  key={feat}
                  className="flex items-center gap-2 bg-green-50 rounded-lg p-3"
                >

                  <CheckCircle
                    size={18}
                    className="text-green-600 flex-shrink-0"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    {feat}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="py-20 bg-gray-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl mx-auto text-center mb-12">

            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">

              <Sparkles size={16} />

              Simple Process

            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>

            <p className="text-gray-500">
              Four simple steps turn surplus food into meaningful support.
            </p>

          </div>


          <div className="grid md:grid-cols-4 gap-6">

            {[
              {
                n: 1,
                icon: '👤',
                title: 'Sign Up',
                desc: 'Create an account as a donor, NGO, or volunteer.'
              },
              {
                n: 2,
                icon: '🍛',
                title: 'Post Food',
                desc: 'Share details about available surplus food.'
              },
              {
                n: 3,
                icon: '📍',
                title: 'Get Matched',
                desc: 'The platform helps connect food with nearby NGOs.'
              },
              {
                n: 4,
                icon: '🤝',
                title: 'Deliver',
                desc: 'Food is collected and delivered to those in need.'
              },
            ].map(({ n, icon, title, desc }) => (

              <div
                key={n}
                className="bg-white rounded-2xl p-6 text-center shadow-sm relative reveal"
              >

                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {n}
                </div>

                <div className="text-4xl mb-3 mt-2">
                  {icon}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section className="py-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl mx-auto text-center mb-12">

            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">

              <Sparkles size={16} />

              Built for Impact

            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Features
            </h2>

            <p className="text-gray-500">
              Simple tools that make food donation easier and more transparent.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-6">

            {[
              {
                Icon: MapPin,
                title: 'Smart Matching',
                desc: 'Connect surplus food with nearby NGOs.'
              },
              {
                Icon: ShieldCheck,
                title: 'Verified NGOs',
                desc: 'Work with trusted and verified organizations.'
              },
              {
                Icon: Eye,
                title: 'Track Donations',
                desc: 'See the progress of your donation.'
              },
              {
                Icon: BarChart,
                title: 'Measure Impact',
                desc: 'Understand how your contributions help.'
              },
              {
                Icon: Smartphone,
                title: 'Easy to Use',
                desc: 'A simple experience for every user.'
              },
              {
                Icon: Users,
                title: 'Volunteer Network',
                desc: 'Help move food where it is needed.'
              },
            ].map(({ Icon, title, desc }) => (

              <div
                key={title}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all reveal"
              >

                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">

                  <Icon
                    size={24}
                    className="text-green-600"
                  />

                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          IMPACT
      ===================================================== */}

      <section className="py-20 bg-gray-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl mx-auto text-center mb-12">

            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">

              <Leaf size={16} />

              Why It Matters

            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Impact
            </h2>

            <p className="text-gray-500">
              Every successful donation creates a positive difference.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-6">

            {[
              {
                icon: '🌿',
                title: 'Environmental',
                desc: 'Less food waste means fewer resources are wasted.'
              },
              {
                icon: '❤️',
                title: 'Social',
                desc: 'More food can reach people who need support.'
              },
              {
                icon: '🤝',
                title: 'Community',
                desc: 'Donors, NGOs, and volunteers work together.'
              },
            ].map(({ icon, title, desc }) => (

              <div
                key={title}
                className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all reveal"
              >

                <div className="text-5xl mb-4">
                  {icon}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {title}
                </h3>

                <p className="text-gray-500">
                  {desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="py-20 text-center hero-gradient">

        <div className="max-w-xl mx-auto px-4">

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">

            <HandHeart size={17} />

            <span className="text-sm">
              Be part of the solution
            </span>

          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Turn Surplus Into Support
          </h2>

          <p className="mb-8 text-lg opacity-90">
            Start your journey with Feed Ferry today.
          </p>

          <button
            onClick={onGetStarted}
            className="cta-pulse bg-white text-purple-700 px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg"
          >
            Get Started Now
          </button>

        </div>

      </section>


      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section id="contact" className="py-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl mx-auto text-center mb-12">

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Contact Us
            </h2>

            <p className="text-gray-500">
              Have a question or want to work with us? Get in touch.
            </p>

          </div>


          <div className="grid md:grid-cols-2 gap-12">

            <div>

              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Get in Touch
              </h3>

              <div className="space-y-4">

                {[
                  {
                    icon: '✉️',
                    label: 'Email',
                    value: 'contact@feedferry.com'
                  },
                  {
                    icon: '📞',
                    label: 'Phone',
                    value: '+91 7709166948'
                  },
                  {
                    icon: '📍',
                    label: 'Location',
                    value: 'Maharashtra, India'
                  },
                  {
                    icon: '📸',
                    label: 'Instagram',
                    value: '@feedferryofficial',
                    link: 'https://www.instagram.com/feedferryofficial'
                  },
                  {
                    icon: '📧',
                    label: 'Gmail',
                    value: 'feedferryofficial@gmail.com',
                    link: 'mailto:feedferryofficial@gmail.com'
                  },
                ].map(({ icon, label, value, link }) => (

                  <div
                    key={label}
                    className="flex items-start gap-4"
                  >

                    <span className="text-2xl">
                      {icon}
                    </span>

                    <div>

                      <h4 className="font-semibold text-gray-700">
                        {label}
                      </h4>

                      {link ? (

                        <a
                          href={link}
                          className="text-green-600 hover:underline"
                        >
                          {value}
                        </a>

                      ) : (

                        <p className="text-gray-500">
                          {value}
                        </p>

                      )}

                    </div>

                  </div>

                ))}

              </div>

            </div>


            <ContactForm />

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-gray-900 text-white py-12">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid md:grid-cols-3 gap-8 mb-8">

            <div>

              <div className="flex items-center gap-2 text-green-400 font-bold text-xl mb-3">

                <Leaf size={20} />

                Feed Ferry

              </div>

              <p className="text-gray-400 text-sm">
                Fighting hunger and food waste through technology.
              </p>

            </div>


            <div>

              <h4 className="font-bold mb-4 text-gray-200">
                Quick Links
              </h4>

              <ul className="space-y-2 text-gray-400 text-sm">

                {[
                  '#home',
                  '#about',
                  '#contact'
                ].map(href => (

                  <li key={href}>

                    <a
                      href={href}
                      className="hover:text-green-400 transition-colors capitalize"
                    >
                      {href.slice(1)}
                    </a>

                  </li>

                ))}

              </ul>

            </div>


            <div>

              <h4 className="font-bold mb-4 text-gray-200">
                Follow Us
              </h4>

              <ul className="space-y-2 text-gray-400 text-sm">

                {[
                  'Facebook',
                  'Twitter',
                  'Instagram'
                ].map(s => (

                  <li key={s}>

                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      {s}
                    </a>

                  </li>

                ))}

              </ul>

            </div>

          </div>


          <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">

            © 2024 Feed Ferry. All rights reserved.
            Turning leftovers into lifelines.

          </div>

        </div>

      </footer>

    </div>
  )
}


/* =========================================================
   CONTACT FORM
========================================================= */

function ContactForm() {

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)


  async function handleSubmit(e) {

    e.preventDefault()

    setLoading(true)

    try {

      const { error } = await supabase
        .from('contacts')
        .insert({ ...form })

      if (error) throw error

      toast.success(
        "Thank you! We'll get back to you soon."
      )

      setForm({
        name: '',
        email: '',
        message: ''
      })

    } catch (err) {

      toast.error(
        err.message ||
        'Failed to send message. Please try again.'
      )

    } finally {

      setLoading(false)

    }

  }


  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <input
        type="text"
        placeholder="Your Name"
        required
        value={form.name}
        onChange={e =>
          setForm(p => ({
            ...p,
            name: e.target.value
          }))
        }
        className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />


      <input
        type="email"
        placeholder="Your Email"
        required
        value={form.email}
        onChange={e =>
          setForm(p => ({
            ...p,
            email: e.target.value
          }))
        }
        className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />


      <textarea
        placeholder="Your Message"
        rows={5}
        required
        value={form.message}
        onChange={e =>
          setForm(p => ({
            ...p,
            message: e.target.value
          }))
        }
        className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
      />


      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors"
      >
        {loading
          ? 'Sending...'
          : 'Send Message'}
      </button>

    </form>

  )
}
