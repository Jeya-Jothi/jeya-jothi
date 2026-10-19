/** Content for the dark panel. Layout and animation live in HeroReveal. */
export default function About() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col text-left">
      <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Left: label + intro */}
        <div>
          <p className="eyebrow text-sceptre-300">About me</p>
          <h2 className="mt-4 text-balance text-[clamp(1.6rem,3.3vw,3.25rem)] leading-[1.1] tracking-[-0.03em] text-white">
            Hey, I’m Jothi - a{" "}
            <span className="text-sceptre-300">frontend developer</span> who
            enjoys turning ideas into thoughtful, interactive digital
            experiences.
          </h2>
        </div>

        {/* Right: story */}
        <div className="space-y-4 text-pretty text-[15px] leading-relaxed text-white/70 sm:text-base lg:pt-8">
          <p>
            For me, frontend development is more than writing code. It’s about
            understanding how people use the web and creating experiences that
            feel intuitive, look beautiful, and work seamlessly across devices.
            I care about the little details, from clean layouts and smooth
            interactions to performance and accessibility.
          </p>
          <p className="hidden md:block">
            I work with technologies like React, Next.js, TypeScript,
            JavaScript, and Tailwind CSS, while continuously exploring new tools
            and better ways to build. I enjoy learning by doing, experimenting
            with ideas, and challenging myself to grow with every opportunity.
          </p>
          <p className="hidden md:block">
            I believe great development comes from a mix of curiosity,
            creativity, and consistency. I’m always looking to improve,
            collaborate with people who love what they do, and turn meaningful
            ideas into products people genuinely enjoy using.
          </p>
        </div>
      </div>

      {/* Bottom row: closing line + AI status chip */}
      <div className="mt-8 flex flex-col gap-5 border-t border-white/15 pt-6 sm:mt-10 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-xl text-pretty text-base text-white/60 sm:text-lg">
          <span className="text-white">Still learning. Always building.</span>{" "}
          Focused on making the web a little better, one experience at a time.
        </p>

        <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-sceptre-200">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-sceptre-400 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-sceptre-400" />
          </span>
          Surviving the AI revolution
          <span aria-hidden="true" className="animate-pulse">
            _
          </span>
        </span>
      </div>
    </div>
  );
}
