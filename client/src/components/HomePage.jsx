import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Sparkles, Target, Zap, Bell, CheckCircle, Star, Brain } from 'lucide-react';
import image1 from '../assets/image1.png';

const HomePage = () => {
  const { openAuthModal } = useOutletContext();

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-gray-900 min-h-screen">
      
      {/* === HERO SECTION === */}
      <section className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden">
        
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400/30 via-blue-400/20 to-transparent blur-3xl animate-pulse" />
          <div className="absolute right-1/4 top-48 h-80 w-80 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-transparent blur-3xl animate-pulse" />
        </div>

        {/* Hero Content */}
        <div className="mx-auto max-w-4xl py-12 sm:py-16 lg:py-20 text-center">
          
          {/* Animated Badge */}
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">AI-Powered Task Management</span>
          </div>

          {/* Main Brand */}
          <div className="mb-12">
            <h1 className="text-7xl sm:text-8xl font-black tracking-tight mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              DASH
            </h1>
            <p className="text-xl sm:text-2xl text-indigo-600 font-bold tracking-wide">
              Decisive Assistant for Scheduling and Handling
            </p>
          </div>

          {/* Headline */}
          <h2 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
            Organize Your Life,<br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Achieve Your Goals
            </span>
          </h2>

          <p className="mt-6 text-lg sm:text-xl leading-relaxed text-gray-600 max-w-2xl mx-auto">
            Transform chaos into clarity with intelligent task management. DASH combines powerful organization tools with AI assistance to help you stay focused and productive.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openAuthModal('register')}
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold text-lg hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Explore Features
              <Target className="h-5 w-5" />
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>AI Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* === FEATURES SECTION === */}
      <section id="features" className="relative py-24 sm:py-32 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Everything You Need to
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Stay Productive
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features designed to simplify your workflow and boost your productivity
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Create & Organize</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Quickly add tasks with titles, descriptions, deadlines, and priority levels. Stay organized effortlessly.
                </p>
                <span className="text-indigo-600 font-semibold text-sm group-hover:underline cursor-pointer">
                  Learn More →
                </span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <Star className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Update & Track</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Mark tasks complete, star important items, or move them to trash. Your dashboard, your rules.
                </p>
                <span className="text-blue-600 font-semibold text-sm group-hover:underline cursor-pointer">
                  Learn More →
                </span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI Powered Insights</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Get daily briefings, smart suggestions, and AI-driven task commands with Gemini integration.
                </p>
                <span className="text-violet-600 font-semibold text-sm group-hover:underline cursor-pointer">
                  Learn More →
                </span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <Bell className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Reminders</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Never miss deadlines with intelligent notifications, multiple alarms, and automated task management.
                </p>
                <span className="text-rose-600 font-semibold text-sm group-hover:underline cursor-pointer">
                  Learn More →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === AI SHOWCASE SECTION === */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-semibold mb-4">
              <Brain className="h-4 w-4" />
              Powered by AI
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Experience the Future of
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Productivity with DASH AI
              </span>
            </h2>
          </div>

          {/* Image Showcase */}
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 hover:scale-105 transition-transform duration-500">
              <img 
                src={image1} 
                alt="AI-powered task management dashboard" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
          </div>

          {/* Description */}
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <p className="text-lg leading-relaxed text-gray-600 mb-8">
              DASH leverages Google Gemini AI to bring intelligent automation to your daily tasks. Get personalized briefings, smart suggestions, and let AI handle routine task management while you focus on what matters most.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm text-gray-700 font-medium">
                ✨ Daily AI Briefings
              </div>
              <div className="px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm text-gray-700 font-medium">
                🎯 Smart Task Suggestions
              </div>
              <div className="px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm text-gray-700 font-medium">
                🤖 Voice Commands
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="relative py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm0 10c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="relative mx-auto max-w-4xl text-center px-6">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of users who have already discovered a smarter way to manage tasks. Start your journey with DASH today.
          </p>
          <button
            onClick={() => openAuthModal('register')}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-white text-indigo-600 font-bold text-lg shadow-2xl hover:scale-105 transition-all duration-300 group"
          >
            Start Free Now
            <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;











// import React from 'react';
// import { Link } from 'react-router-dom';
// import image1 from '../assets/image1.png';
// import ParallaxFeatureCard from './ParallaxFeatureCard';

// const HomePage = () => {
//   return (
//     <div className="bg-white text-gray-900 min-h-screen">
//       {/* --- HERO SECTION --- */}
//       <div className="relative isolate px-6 pt-14 lg:px-8">
//         {/* Decorative background element */}
//         <div
//           className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
//           aria-hidden="true"
//         >
//           <div
//             className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] 
//                        -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr 
//                        from-[#ff80b5] to-[#9089fc] opacity-30 
//                        sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
//             style={{
//               clipPath:
//                 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
//             }}
//           />
//         </div>

//         {/* --- Main Hero Content --- */}
//         <div className="mx-auto max-w-3xl py-20 sm:py-32 lg:py-40 text-center animate-[fade-in-up_1s_ease-out_forwards]">
          
//           {/* Project Name & Full Form */}
//           <div className="animate-[fade-in-up_0.8s_ease-out_forwards]">
//             <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-[#4f46e5] to-[#9089fc] bg-clip-text text-transparent">
//               DASH
//             </h1>
//             <p className="text-lg sm:text-xl text-button-primary font-medium mb-10">
//               Decisive Assistant for Scheduling and Handling
//             </p>
//           </div>

//           {/* Main Headline */}
//           <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
//             Organize Your Life, Achieve Your Goals
//           </h2>

//           <p className="mt-6 text-lg leading-8 text-gray-600">
//             DASH is your decisive assistant for scheduling. A clean, fast, and simple way to manage your tasks...
//           </p>

//           {/* Buttons */}
//           <div className="mt-10 flex items-center justify-center gap-x-6">
//             <Link
//               to="/register"
//               className="rounded-md bg-button-primary px-4 py-2 text-base font-semibold text-white shadow-lg 
//                          hover:bg-button-hover focus-visible:outline focus-visible:outline-2 
//                          focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
//                          transition-all duration-300"
//             >
//               Get started for free
//             </Link>
//             <a
//               href="#how-it-works"
//               className="text-base font-semibold leading-6 text-text-link hover:text-text-link-hover transition-colors duration-300"
//             >
//               Learn more <span aria-hidden="true">&rarr;</span>
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* --- "HOW IT WORKS" / FEATURES SECTION --- */}
//       <div id="how-it-works" className="bg-gray-50 py-24 sm:py-32 border-t border-gray-200">
//         <div className="mx-auto max-w-7xl px-6 lg:px-8">
//           <div className="mx-auto max-w-2xl lg:text-center">
//             <h2 className="text-base font-semibold leading-7 text-button-primary">How It Works</h2>
//             <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//               Everything you need to be productive
//             </p>
//             <p className="mt-6 text-lg leading-8 text-gray-600">
//               DASH simplifies your workflow with powerful, easy-to-use features.
//             </p>
//           </div>

//           {/* Feature Cards */}
//           <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
//             <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 
//                            lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
//               <ParallaxFeatureCard
//                 icon="🚀"
//                 title="Create & Organize"
//                 description="Quickly add new tasks with titles, descriptions, deadlines, and priority levels."
//               />
//               <ParallaxFeatureCard
//                 icon="✨"
//                 title="Update & Track"
//                 description="Mark tasks as complete, star them for importance, or move them to the trash. Your dashboard, your rules."
//               />
//               <ParallaxFeatureCard
//                 icon="🤖"
//                 title="AI Powered Insights"
//                 description="Get daily briefings, smart suggestions, and command tasks using our integrated Gemini AI assistant."
//               />
//               <ParallaxFeatureCard
//                 icon="⏰"
//                 title="Automated Reminders & Cleanup"
//                 description="Never miss a deadline with multiple alarms and daily repeats. Overdue tasks are managed automatically."
//               />
//             </dl>
//           </div>
//         </div>
//       </div>

//       {/* --- AI SHOWCASE SECTION --- */}
//       <div className="bg-white py-24 sm:py-32 text-center border-t border-gray-200">
//         <div className="mx-auto max-w-7xl px-6 lg:px-8">
//           <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-12">
//             Experience the Future of Productivity with DASH AI
//           </h2>
//           <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-gray-100">
//             <img src={image1} alt="AI-powered task management" className="w-full h-auto object-cover" />
//           </div>
//           <p className="mt-8 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
//             DASH leverages Google Gemini AI to bring intelligent automation to your daily tasks...
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;






