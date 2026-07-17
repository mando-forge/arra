import {
  ArrowRight,
  BookOpen,
  Clock3,
  FileText,
  MessageSquareText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { TiltCard } from "@/components/ui/tilt-card"

type DashboardSubmission = {
  id: string
  intent: string
  status: string
  created_at: string
}

type DashboardPost = {
  id: string
  title: string
  excerpt: string
  status: string
  created_at: string
  updated_at?: string | null
}

type DashboardDocument = {
  title: string
  chunks: number
  created_at: string
}

type AdminTodayProps = {
  submissions: DashboardSubmission[]
  posts: DashboardPost[]
  documents?: DashboardDocument[]
  onNavigate: (destination: "inquiries" | "cms" | "knowledge") => void
  onOpenInquiry: (submission: DashboardSubmission) => void
  onEditPost?: (post: DashboardPost) => void
}

function shortId(prefix: string, id: string) {
  return `${prefix}-${id.replaceAll("-", "").slice(0, 8).toUpperCase()}`
}

export function AdminToday({
  submissions,
  posts,
  documents,
  onNavigate,
  onOpenInquiry,
  onEditPost,
}: AdminTodayProps) {
  const newSubmissions = submissions.filter(
    (submission) => submission.status === "new"
  )
  const featuredPost = posts.find((post) => post.status === "draft") ?? posts[0]
  const recentPosts = posts.slice(0, 4)
  const recentDocuments = documents?.slice(0, 3) ?? []
  const draftCount = posts.filter((post) => post.status === "draft").length
  const today = new Date()
  const weekday = new Intl.DateTimeFormat("en-IN", { weekday: "long" }).format(
    today
  )
  const calendarDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today)

  return (
    <div className="grid min-h-[calc(100vh-5.5rem)] xl:grid-cols-[16rem_minmax(0,1fr)_19rem]">
      <aside className="hidden border-r border-border px-8 py-10 xl:flex xl:flex-col">
        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          {weekday}
        </p>
        <p className="mt-3 font-serif text-[2rem] leading-none text-primary">
          {calendarDate}
        </p>
        <span className="bg-arra-ochre mt-7 h-0.5 w-8" aria-hidden="true" />
        <p className="mt-8 font-serif text-lg leading-relaxed text-muted-foreground italic">
          Observe closely.
          <br />
          Record faithfully.
          <br />
          Share carefully.
        </p>
        <img
          src="/images/arra-dashboard-bamboo-study.png"
          alt="Pale botanical bamboo field study"
          className="mx-auto mt-6 h-64 w-full object-contain opacity-80"
        />

        <div className="mt-auto pt-10">
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            Today&apos;s attention
          </p>
          <div className="mt-3 divide-y divide-border border-y border-border">
            <button
              onClick={() => onNavigate("inquiries")}
              className="flex w-full items-center justify-between py-3 text-left text-sm hover:text-primary"
            >
              <span>Review inquiries</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {newSubmissions.length}
              </span>
            </button>
            <button
              onClick={() => onNavigate("cms")}
              className="flex w-full items-center justify-between py-3 text-left text-sm hover:text-primary"
            >
              <span>Field-note writing</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {draftCount}
              </span>
            </button>
            <button
              onClick={() => onNavigate("knowledge")}
              className="flex w-full items-center justify-between py-3 text-left text-sm hover:text-primary"
            >
              <span>Source follow-ups</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {documents?.length ?? 0}
              </span>
            </button>
          </div>
        </div>
      </aside>

      <section className="min-w-0 px-5 py-10 sm:px-8 lg:px-11 lg:py-11">
        <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase xl:hidden">
          {weekday}, {calendarDate}
        </p>
        <h1 className="font-serif text-5xl leading-none text-primary sm:text-6xl">
          Today
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Your workspace for careful work.
        </p>
        <span
          className="bg-arra-ochre mt-6 block h-0.5 w-8"
          aria-hidden="true"
        />

        <TiltCard className="mt-12">
          <div className="grid items-center gap-8 border border-border bg-card p-8 shadow-sm lg:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]">
            <div style={{ transform: "translateZ(30px)" }}>
              <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                Latest update
              </p>
              <h2 className="mt-7 max-w-2xl font-serif text-3xl leading-[1.08] text-primary sm:text-4xl">
                {featuredPost?.title ?? "Prepare the first ARRA-CORE update"}
              </h2>
              <p className="mt-5 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                {featuredPost
                  ? `${featuredPost.status} · Last updated ${new Date(featuredPost.updated_at ?? featuredPost.created_at).toLocaleDateString("en-IN")}`
                  : "Updates · Ready for a first draft"}
              </p>
              <p className="mt-6 max-w-xl text-[15px] leading-7 text-muted-foreground">
                {featuredPost?.excerpt ||
                  "Document an observation, add the regional context, and shape it into a measured public note when the evidence is ready."}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Button
                  onClick={() => {
                    if (featuredPost && onEditPost) {
                      onEditPost(featuredPost)
                    } else {
                      onNavigate("cms")
                    }
                  }}
                  className="h-12 rounded-none bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                >
                  <ArrowRight className="mr-2 size-4" />
                  {featuredPost
                    ? featuredPost.status === "draft"
                      ? "Continue latest draft"
                      : "Edit latest update"
                    : "Create an update"}
                </Button>
                <button
                  type="button"
                  onClick={() => onNavigate("cms")}
                  className="inline-flex items-center gap-3 border-b border-primary pb-1 text-sm text-primary hover:opacity-65"
                >
                  Open updates <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
            <figure 
              className="overflow-hidden bg-muted"
              style={{ transform: "translateZ(15px)" }}
            >
              <img
                src="/images/arra-cel-regional-terrain-v3.png"
                alt="Layered mountains, water, vegetation, and two homes rendered as a restrained landscape illustration"
                className="aspect-[1.04/1] h-full w-full object-cover opacity-80"
              />
            </figure>
          </div>
        </TiltCard>

        <div className="mt-14">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              Recent work
            </p>
            <button
              onClick={() => onNavigate("cms")}
              className="text-sm text-primary hover:opacity-65"
            >
              View all
            </button>
          </div>
          {recentPosts.length > 0 ? (
            <div className="divide-y divide-border">
              {recentPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => onNavigate("cms")}
                  className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 py-4 text-left hover:text-primary"
                >
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {shortId("FN", post.id)}
                  </span>
                  <span className="truncate text-sm">{post.title}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {new Date(
                      post.updated_at ?? post.created_at
                    ).toLocaleDateString("en-IN")}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-start gap-3 border-b border-border py-6 text-sm text-muted-foreground">
              <BookOpen className="mt-0.5 size-4" />
              <p>
                No updates yet. Begin with a draft when the first
                observation is ready.
              </p>
            </div>
          )}
        </div>
      </section>

      <aside className="border-t border-border px-5 py-9 sm:px-8 xl:border-t-0 xl:border-l xl:px-9 xl:py-10">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            Inquiries
          </p>
          <div className="mt-3 flex items-end justify-between">
            <h2 className="font-serif text-3xl text-primary">New inquiries</h2>
            <span className="font-mono text-[10px] text-muted-foreground">
              {newSubmissions.length}
            </span>
          </div>
          <div className="mt-5 divide-y divide-border border-y border-border">
            {newSubmissions.length > 0 ? (
              newSubmissions.slice(0, 3).map((submission) => (
                <button
                  key={submission.id}
                  onClick={() => onOpenInquiry(submission)}
                  className="group w-full py-4 text-left"
                >
                  <span className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                    <span className="bg-arra-ochre size-1.5 rounded-none" />
                    {new Date(submission.created_at).toLocaleTimeString(
                      "en-IN",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </span>
                  <span className="mt-2 line-clamp-2 block text-sm leading-6 group-hover:text-primary">
                    {submission.intent}
                  </span>
                  <span className="mt-2 block font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
                    {shortId("INQ", submission.id)}
                  </span>
                </button>
              ))
            ) : (
              <div className="flex gap-3 py-6 text-sm leading-6 text-muted-foreground">
                <MessageSquareText className="mt-1 size-4 shrink-0" />
                <p>No new inquiries. The inbox is clear.</p>
              </div>
            )}
          </div>
          <button
            onClick={() => onNavigate("inquiries")}
            className="mt-5 inline-flex items-center gap-3 border-b border-primary pb-1 text-sm text-primary hover:opacity-65"
          >
            View all inquiries <ArrowRight className="size-4" />
          </button>
        </div>

        <div className="mt-12">
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            Knowledge
          </p>
          <h2 className="mt-3 font-serif text-3xl text-primary">
            Knowledge updates
          </h2>
          <div className="mt-5 divide-y divide-border border-y border-border">
            {recentDocuments.length > 0 ? (
              recentDocuments.map((document) => (
                <button
                  key={`${document.title}-${document.created_at}`}
                  onClick={() => onNavigate("knowledge")}
                  className="group flex w-full gap-3 py-4 text-left"
                >
                  <FileText className="mt-1 size-4 shrink-0 text-muted-foreground" />
                  <span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {new Date(document.created_at).toLocaleDateString(
                        "en-IN"
                      )}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm leading-6 group-hover:text-primary">
                      {document.title}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <div className="flex gap-3 py-6 text-sm leading-6 text-muted-foreground">
                <BookOpen className="mt-1 size-4 shrink-0" />
                <p>No source documents have been added yet.</p>
              </div>
            )}
          </div>
          <button
            onClick={() => onNavigate("knowledge")}
            className="mt-5 inline-flex items-center gap-3 border-b border-primary pb-1 text-sm text-primary hover:opacity-65"
          >
            View knowledge base <ArrowRight className="size-4" />
          </button>
        </div>

        <div className="mt-12 flex items-center gap-3 border-t border-border pt-5 text-xs text-muted-foreground xl:hidden">
          <Clock3 className="size-4" />
          All times shown in your local timezone.
        </div>
      </aside>
    </div>
  )
}
