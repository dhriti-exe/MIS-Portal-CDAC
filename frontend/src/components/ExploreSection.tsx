import { useMemo, useState } from "react";

type CardItem = {
  id: string;
  title: string;
  subtitle: string;
  meta1: string;
  meta2: string;
  imageUrl: string;
  ctaLabel: string;
};

type TabKey = "courses" | "institutions";

export default function ExploreSection() {
    const [activeTab, setActiveTab] = useState<TabKey>("courses");

    const latestCourses: CardItem[] = useMemo(
        () => [
        {
            id: "c1",
            title: "Cloud Basics",
            subtitle: "AWS • Azure • GCP basics",
            meta1: "Beginner • 6 weeks",
            meta2: "Projects: 3",
            imageUrl: "https://picsum.photos/seed/course-cloud/900/650",
            ctaLabel: "Know more",
        },
        {
            id: "c2",
            title: "AI for Everyone",
            subtitle: "Prompting + AI workflows",
            meta1: "Beginner • 4 weeks",
            meta2: "Hands-on: Yes",
            imageUrl: "https://picsum.photos/seed/course-ai/900/650",
            ctaLabel: "Know more",
        },
        {
            id: "c3",
            title: "Full-Stack Web",
            subtitle: "React + FastAPI + Postgres",
            meta1: "Intermediate • 8 weeks",
            meta2: "Capstone: 1",
            imageUrl: "https://picsum.photos/seed/course-web/900/650",
            ctaLabel: "Know more",
        },
        {
            id: "c4",
            title: "Data Analytics",
            subtitle: "SQL + Dashboards + Insights",
            meta1: "Beginner • 5 weeks",
            meta2: "Case studies: 4",
            imageUrl: "https://picsum.photos/seed/course-data/900/650",
            ctaLabel: "Know more",
        },
        {
            id: "c5",
            title: "Cybersecurity Basics",
            subtitle: "Threats, OWASP, hygiene",
            meta1: "Beginner • 4 weeks",
            meta2: "Labs: 8",
            imageUrl: "https://picsum.photos/seed/course-cyber/900/650",
            ctaLabel: "Know more",
        },
        ],
        []
    );

    const participatingInstitutions: CardItem[] = useMemo(
        () => [
        {
            id: "i1",
            title: "NIT Durgapur",
            subtitle: "Partner Institution",
            meta1: "Programs: 12",
            meta2: "Students: 4,500+",
            imageUrl: "https://picsum.photos/seed/inst-1/900/650",
            ctaLabel: "Know more",
        },
        {
            id: "i2",
            title: "IIIT Hyderabad",
            subtitle: "Academic Collaborator",
            meta1: "Programs: 9",
            meta2: "Students: 3,100+",
            imageUrl: "https://picsum.photos/seed/inst-2/900/650",
            ctaLabel: "Know more",
        },
        {
            id: "i3",
            title: "Jadavpur University",
            subtitle: "Training Partner",
            meta1: "Programs: 7",
            meta2: "Students: 2,800+",
            imageUrl: "https://picsum.photos/seed/inst-3/900/650",
            ctaLabel: "Know more",
        },
        {
            id: "i4",
            title: "IIT Kharagpur",
            subtitle: "Institutional Partner",
            meta1: "Programs: 10",
            meta2: "Students: 5,200+",
            imageUrl: "https://picsum.photos/seed/inst-4/900/650",
            ctaLabel: "Know more",
        },
        {
            id: "i5",
            title: "BITS Pilani",
            subtitle: "Campus Partner",
            meta1: "Programs: 8",
            meta2: "Students: 3,900+",
            imageUrl: "https://picsum.photos/seed/inst-5/900/650",
            ctaLabel: "Know more",
        },
        ],
        []
    );

    const currentList = activeTab === "courses" ? latestCourses : participatingInstitutions;

    const onKnowMore = (item: CardItem) => {
        // Replace with navigation / modal: navigate(`/courses/${id}`) or `/institutions/${id}`
        alert(`Know more: ${item.title}`);
    };

    return (
        <section className="w-full bg-white">
            <div className="mx-auto max-w-7xl px-2 py-10 sm:px-4 lg:px-8">
                <div className="text-center">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    Explore the Platform
                </h2>
                <p className="mx-auto mt-1 max-w-2xl text-sm text-gray-600 sm:text-base">
                    Browse the latest courses and see institutions participating in the program.
                </p>
                </div>

                <div className="mt-3">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <TabButton
                        active={activeTab === "courses"}
                        onClick={() => setActiveTab("courses")}
                        label="Latest Courses"
                        className="w-1/2"
                    />
                    <TabButton
                        active={activeTab === "institutions"}
                        onClick={() => setActiveTab("institutions")}
                        label="Participating Institutions"
                        className="w-1/2"
                    />
                </div>

                <div className="mt-7">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {currentList.map((item) => (
                        <HoverCard key={item.id} item={item} onKnowMore={onKnowMore} />
                    ))}
                    </div>
                </div>

                <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    {activeTab === "courses" && (
                    <button
                        type="button"
                        onClick={() => alert("View all: Latest Courses")}
                        className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition sm:w-auto"
                    >
                        View all Latest Courses →
                    </button>
                    )}
                    {activeTab === "institutions" && (
                    <button
                        type="button"
                        onClick={() => alert("View all: Participating Institutions")}
                        className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition sm:w-auto"
                    >
                        View all Institutions →
                    </button>
                    )}
                </div>
                </div>
            </div>
        </section>
    );
}

function TabButton({
    active,
    onClick,
    label,
    className = "",
}: {
    active: boolean;
    onClick: () => void;
    label: string;
    className?: string;
}) {
    return (
        <button
        type="button"
        onClick={onClick}
        className={[
            "relative py-2 text-sm font-semibold transition text-center",
            active ? "text-indigo-700" : "text-gray-600 hover:text-gray-900",
            className
        ].join(" ")}
        >
        {label}
        <span
            className={[
            "absolute -bottom-3 left-0 h-[2px] w-full transform transition",
            active ? "scale-x-100 bg-indigo-700" : "scale-x-0 bg-transparent",
            ].join(" ")}
        />
        </button>
    );
}

function HoverCard({
  item,
  onKnowMore,
}: {
  item: CardItem;
  onKnowMore: (item: CardItem) => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[3.5/5] w-full">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="rounded-xl bg-black/35 px-3 py-2 backdrop-blur-[2px]">
            <div className="text-base font-bold text-white">{item.title}</div>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <div className="rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-md">
              <div className="text-lg font-extrabold text-white">{item.title}</div>
              <div className="mt-1 text-sm text-white/80">{item.subtitle}</div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
                  {item.meta1}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
                  {item.meta2}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onKnowMore(item)}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-100 transition"
              >
                {item.ctaLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
