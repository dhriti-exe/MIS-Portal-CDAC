import { useEffect, useMemo, useState } from "react";
import { useCountUp } from "./useCountUp";

type ImpactStat = {
  id: string;
  value: string;
  label: string;
};

/**
 * Mock dynamic fetch (replace with your API call later)
 */
async function fetchImpactStatsMock(): Promise<{
  title: string;
  subtitle: string;
  stats: ImpactStat[];
}> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 400));

  return {
    title: "Building Careers with Real-World Skills",
    subtitle:
      "A quick snapshot of our reach, partnerships, and learner outcomes across India.",
    stats: [
      { id: "users", value: "28.4L+", label: "Learners on the platform" },
      { id: "enroll", value: "14.9L+", label: "Program enrollments" },
      { id: "catalog", value: "2,850+", label: "Courses in catalog" },
      { id: "partners", value: "18", label: "Govt. collaborations" },
      { id: "institutes", value: "2,200+", label: "Institutes onboarded" },
      { id: "companies", value: "190+", label: "Industry partners" },
      { id: "badges", value: "1.9Cr+", label: "Skill badges issued" },
      { id: "women", value: "44%", label: "Women learners" },
      { id: "cities", value: "800+", label: "Tier-2/3 city reach" },
      { id: "completion", value: "62%", label: "Avg. completion rate" },
    ],
  };
}

export default function ImpactHighlightSection() {
  const [loading, setLoading] = useState(true);

  // Dynamic content state (today: mock; later: API)
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [stats, setStats] = useState<ImpactStat[]>([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetchImpactStatsMock();
        if (!alive) return;

        setTitle(res.title);
        setSubtitle(res.subtitle);
        setStats(res.stats);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const { topRow, bottomRow } = useMemo(() => {
    // Inspired layout: top row feels "wide", bottom row feels "highlighted"
    // We’ll split 7 on top, rest on bottom (works for any length)
    const firstRowCount = Math.min(7, stats.length);
    return {
      topRow: stats.slice(0, firstRowCount),
      bottomRow: stats.slice(firstRowCount),
    };
  }, [stats]);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background (inspired, not copied): gradient + subtle pattern + soft image) */}
      <div className="absolute inset-0">
        <div className="h-full w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Glow blobs */}
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
      </div>

      {/* Prevent horizontal overflow from any nested elements */}
      <div className="relative overflow-x-hidden">
        {/* Container */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-14 sm:py-16 lg:py-20">
            {/* Header */}
            <div className="text-center">
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {loading ? "Loading impact..." : title}
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base lg:text-lg">
                {loading
                  ? "Fetching latest numbers for you."
                  : subtitle}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-12">
              {/* Top row */}
              <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                {topRow.map((s, idx) => (
                  <StatCard
                    key={s.id}
                    stat={s}
                    showDivider={idx !== 0}
                    variant="compact"
                  />
                ))}
              </div>

              {/* Bottom row (centered “highlight” band) */}
              {bottomRow.length > 0 ? (
                <div className="mt-10 flex justify-center">
                  <div className="w-full max-w-4xl rounded-2xl border border-white/12 bg-white/5 px-4 py-8 backdrop-blur-sm sm:px-8">
                    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-3">
                      {bottomRow.map((s, idx) => (
                        <StatCard
                          key={s.id}
                          stat={s}
                          showDivider={idx !== 0}
                          variant="featured"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Card-like stat (inspired: separators + centered typography)
 * Not a copy: uses a glass band style and a compact/featured variant.
 */
function StatCard({
  stat,
  showDivider,
  variant,
}: {
  stat: ImpactStat;
  showDivider: boolean;
  variant: "compact" | "featured";
}) {
  const valueClass =
    variant === "featured"
      ? "text-3xl sm:text-4xl"
      : "text-2xl sm:text-3xl";

  const labelClass =
    variant === "featured"
      ? "text-sm sm:text-base"
      : "text-xs sm:text-sm";

  const animatedValue = useCountUp(stat.value);

  return (
    <div className="relative flex flex-col items-center justify-center px-4 text-center">
      {/* Divider (md+) */}
      <div
        className={[
          "absolute left-0 top-1/2 hidden h-12 -translate-y-1/2 border-l border-white/25",
          showDivider ? "md:block" : "",
        ].join(" ")}
      />

      <div className={`font-extrabold tracking-tight text-white ${valueClass}`}>
        {animatedValue}
      </div>

      <div className={`mt-2 font-medium text-white/80 ${labelClass}`}>
        {stat.label}
      </div>
    </div>
  );
}
