export default function AboutSection() {
  return (
    <section id="about" id="main-content" className="animate-section relative py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-16 bg-[#f5f5f5] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <div className="overflow-hidden">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight animate-fade-in-up">
                <span className="inline-block hover:text-[#4D64FF] transition-colors duration-300">
                  Who I Am
                </span>
              </h2>
            </div>

            <div className="overflow-hidden">
              <div className="space-y-6 animate-fade-in-up animation-delay-200">
                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                  I'm Fares Bermak, a disciplined Remote Administrative Professional who converts chaotic manual processes into dependable digital systems.
                </p>

                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                  I specialize in high-accuracy data management, workflow automation with Zapier and Advanced Excel, and maintaining strict integrity across financial and operational records.
                </p>

                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                  Trilingual (Arabic, English, French) with proven experience in asynchronous remote collaboration, I've helped businesses eliminate hours of repetitive work each week while reducing errors and improving team coordination.
                </p>

                <div className="pt-4 border-l-4 border-[#4D64FF] pl-6 bg-white/50 py-4 rounded-r-lg">
                  <p className="text-lg md:text-xl text-gray-900 font-medium italic leading-relaxed">
                    My approach is simple: Build systems that work reliably, automate what shouldn't require human attention, and keep everything organized so your business scales without friction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl animate-fade-in-right">
              <img
                src="/about me pic.jpeg"
                alt="Fares Bermak - Professional Profile"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#4D64FF] rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#4D64FF] rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
