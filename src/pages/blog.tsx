import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import DOMPurify from "dompurify"
import { supabase } from "@/lib/supabase"
import { Loader2, ArrowLeft, Calendar, User } from "lucide-react"
import { FlickeringGrid } from "@/components/ui/flickering-grid"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  published_at: string
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    async function loadPosts() {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, slug, excerpt, content, published_at")
          .eq("status", "published")
          .order("published_at", { ascending: false })

        if (error) throw error
        setPosts(data || [])
      } catch (err) {
        console.error("Failed to load blog posts:", err)
      } finally {
        setLoading(false)
      }
    }
    void loadPosts()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex min-h-[65vh] items-center justify-center font-mono text-xs text-foreground/60">
        <Loader2 className="animate-spin size-5 mr-2 text-[var(--arra-ochre)]" />
        SYNCHRONIZING JOURNAL...
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden w-full min-h-[75vh] py-20">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <FlickeringGrid
          className="absolute inset-0 size-full z-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-30"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.5}
          flickerChance={0.1}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <AnimatePresence mode="wait">
          {!selectedPost ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <div className="max-w-xl">
                <p className="mono-label text-[var(--arra-fjord)]">Field notes</p>
                <h1 className="serif-display mt-4 text-4xl leading-tight md:text-5xl font-semibold">
                  Writing and observations from our research.
                </h1>
              </div>

              {posts.length === 0 ? (
                <div className="border border-border/60 bg-muted/5 p-8 max-w-xl font-mono text-xs text-foreground/50 rounded-sm">
                  No published entries found in the neural network index. Please run the seeder inside the Admin control panel to populate content.
                </div>
              ) : (
                <div className="grid gap-8 max-w-3xl border-t border-border pt-8">
                  {posts.map((post) => (
                    <article 
                      key={post.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedPost(post)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setSelectedPost(post)
                        }
                      }}
                      className="group cursor-pointer space-y-3 pb-8 border-b border-border last:border-b-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-arra-cyan/50"
                    >
                      <div className="flex items-center gap-3 text-[10px] font-mono text-foreground/40">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <User className="size-3" />
                          ARRA Team
                        </span>
                      </div>

                      <h2 className="font-serif text-2xl font-semibold leading-tight group-hover:text-[var(--arra-ochre)] transition-colors">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-sm text-foreground/75 leading-relaxed font-sans max-w-2xl">
                          {post.excerpt}
                        </p>
                      )}

                      <span className="inline-flex items-center border-b border-current pb-0.5 text-xs font-mono font-medium tracking-wide uppercase mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        Read Entry
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="article"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="size-3.5" />
                Back to notes
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-mono text-foreground/40">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(selectedPost.published_at).toLocaleDateString()}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <User className="size-3" />
                    ARRA Team
                  </span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight text-foreground">
                  {selectedPost.title}
                </h1>
              </div>

              <div 
                className="prose dark:prose-invert max-w-none text-[0.98rem] leading-[1.8] text-foreground/80 space-y-6 font-sans"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedPost.content) }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
