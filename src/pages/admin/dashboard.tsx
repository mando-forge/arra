import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Upload,
  Loader2,
  CheckCircle2,
  Trash2,
  Eye,
  Search,
  Check,
  Archive,
  FileText,
  HelpCircle,
  FileEdit,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"

import { AdminToday } from "@/components/admin-today"
import { AdminSettings } from "@/components/admin-settings"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  status: string
  published_at: string
  created_at: string
  updated_at?: string | null
}

type Submission = {
  id: string
  name: string
  email: string
  intent: string
  message: string
  status: string
  created_at: string
}

type IngestedDoc = {
  title: string
  chunks: number
  created_at: string
}


export default function AdminDashboard() {
  const { hash } = useLocation()
  const navigate = useNavigate()

  // Derive active tab from hash routing
  const requestedTab = hash ? hash.replace("#", "") : "overview"
  const activeTab = [
    "overview",
    "inquiries",
    "cms",
    "knowledge",
    "settings",
    "support",
  ].includes(requestedTab)
    ? requestedTab
    : "overview"

  const handleTabChange = (val: string) => {
    navigate(`#${val}`)
  }

  // Data states
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [docs, setDocs] = useState<IngestedDoc[]>()

  // Loading states
  const [loading, setLoading] = useState(true)
  const [ingestLoading, setIngestLoading] = useState(false)
  const [purgingDoc, setPurgingDoc] = useState<string | null>(null)
  const [reembeddingDoc, setReembeddingDoc] = useState<string | null>(null)
  const [cmsLoading, setCmsLoading] = useState(false)

  // Form states (Knowledge)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [ingestStatus, setIngestStatus] = useState<
    "idle" | "success" | "error"
  >("idle")

  // Form states (CMS Blog)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [postTitle, setPostTitle] = useState("")
  const [postSlug, setPostSlug] = useState("")
  const [postExcerpt, setPostExcerpt] = useState("")
  const [postContent, setPostContent] = useState("")
  const [postStatus, setPostStatus] = useState("draft")


  // Filter/Search states
  const [inquirySearch, setInquirySearch] = useState("")
  const [inquiryFilter, setInquiryFilter] = useState<
    "all" | "new" | "read" | "archived"
  >("all")
  const [postSearch, setPostSearch] = useState("")
  const [docSearch, setDocSearch] = useState("")

  // Detail views
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null)


  // Fetch all data from database
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true)

    try {
      // 1. Fetch Contact Submissions
      const { data: subData, error: subError } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })

      if (subError) throw subError
      setSubmissions(subData || [])

      // 2. Fetch Blog Posts for CMS
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })

      if (postsError) throw postsError
      setPosts(postsData || [])

      // 3. Fetch Knowledge Base chunks and group them
      const { data: kbData, error: kbError } = await supabase
        .from("knowledge_base")
        .select("id, title, metadata, created_at")

      if (kbError) throw kbError

      const documentsMap: Record<
        string,
        { title: string; chunks: number; created_at: string }
      > = {}
      kbData?.forEach((row) => {
        const docTitle = row.metadata?.source_title || row.title
        if (!documentsMap[docTitle]) {
          documentsMap[docTitle] = {
            title: docTitle,
            chunks: 0,
            created_at: row.created_at,
          }
        }
        documentsMap[docTitle].chunks += 1
      })

      const uniqueDocs = Object.values(documentsMap)
      setDocs(uniqueDocs)
    } catch (err: unknown) {
      console.error("Data synchronization failed:", err)
      toast.error("Database Synchronization Failed")
    } finally {
      if (!silent) setLoading(false)
    }
  }

  // Load data on mount & listen to sync events
  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchData()
    }, 0)

    const handleSync = () => void fetchData(false)
    window.addEventListener("sync-core", handleSync)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("sync-core", handleSync)
    }
  }, [])


  // Submissions Actions
  const updateSubmissionStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: newStatus })
        .eq("id", id)

      if (error) throw error

      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      )

      if (selectedSubmission?.id === id) {
        setSelectedSubmission((prev) =>
          prev ? { ...prev, status: newStatus } : null
        )
      }

      toast.success(`Submission marked as ${newStatus}`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to update status")
    }
  }

  const deleteSubmission = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this contact submission record?"
      )
    )
      return
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id)

      if (error) throw error

      setSubmissions((prev) => prev.filter((s) => s.id !== id))
      if (selectedSubmission?.id === id) setSelectedSubmission(null)

      toast.success("Submission record deleted")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete submission")
    }
  }

  // CMS Blog Actions
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!postTitle.trim() || !postSlug.trim() || !postContent.trim()) return

    setCmsLoading(true)

    const postData = {
      title: postTitle,
      slug: postSlug,
      excerpt: postExcerpt,
      content: postContent,
      status: postStatus,
      updated_at: new Date(),
    }

    try {
      if (editingPost) {
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", editingPost.id)

        if (error) throw error
        toast.success("Post updated successfully")
      } else {
        const { error } = await supabase
          .from("posts")
          .insert([
            {
              ...postData,
              published_at: postStatus === "published" ? new Date() : null,
            },
          ])

        if (error) throw error
        toast.success("Post created successfully")
      }

      setPostTitle("")
      setPostSlug("")
      setPostExcerpt("")
      setPostContent("")
      setPostStatus("draft")
      setEditingPost(null)
      void fetchData(true)
    } catch (err) {
      console.error(err)
      toast.error("Failed to save post")
    } finally {
      setCmsLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this blog post?"))
      return
    try {
      const { error } = await supabase.from("posts").delete().eq("id", id)

      if (error) throw error
      setPosts((prev) => prev.filter((p) => p.id !== id))
      toast.success("Post deleted")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete post")
    }
  }

  // Ingest Knowledge Action
  const handleIngestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIngestLoading(true)
    setIngestStatus("idle")

    try {
      const { error } = await supabase.functions.invoke("ingest-knowledge", {
        body: { title, content },
      })

      if (error) throw error

      setIngestStatus("success")
      toast.success("Document ingested and embedded successfully")
      setTitle("")
      setContent("")
      // Reload knowledge base docs
      void fetchData(true)
    } catch (err) {
      console.error("Failed to ingest knowledge:", err)
      setIngestStatus("error")
      toast.error("Ingestion pipeline error")
    } finally {
      setIngestLoading(false)
    }
  }

  // Purge Knowledge Document Action
  const handlePurgeDoc = async (docTitle: string) => {
    if (
      !confirm(
        `Warning: This will permanently delete all vector chunks, embeddings, and content associated with "${docTitle}". Proceed?`
      )
    )
      return

    setPurgingDoc(docTitle)

    try {
      // 1. Delete rows matching metadata source_title
      const { error: metadataError } = await supabase
        .from("knowledge_base")
        .delete()
        .contains("metadata", { source_title: docTitle })

      if (metadataError) throw metadataError

      // 2. Delete rows matching exact title
      const { error: titleError } = await supabase
        .from("knowledge_base")
        .delete()
        .eq("title", docTitle)

      if (titleError) throw titleError

      setDocs((prev) => prev?.filter((d) => d.title !== docTitle))
      toast.success(`Scrubbed "${docTitle}" from knowledge base`)
    } catch (err) {
      console.error("Scrubbing failed:", err)
      toast.error("Failed to delete document")
    } finally {
      setPurgingDoc(null)
    }
  }

  // Re-embed Knowledge Document Action
  const handleReembedDoc = async (docTitle: string) => {
    if (!confirm(`This will regenerate all vector embeddings for "${docTitle}". Proceed?`)) return

    setReembeddingDoc(docTitle)
    try {
      // Fetch the document content from the database
      const { data: rows, error: fetchError } = await supabase
        .from("knowledge_base")
        .select("content")
        .contains("metadata", { source_title: docTitle })
        .order("created_at", { ascending: true })

      if (fetchError) throw fetchError
      if (!rows?.length) throw new Error("Document not found in knowledge base")

      // Reconstruct the full content from all chunks
      const fullContent = rows.map((r) => r.content).join("\n\n")

      // Re-ingest through the Edge Function (which now prepends title to embedding input)
      const { error } = await supabase.functions.invoke("ingest-knowledge", {
        body: { title: docTitle, content: fullContent },
      })
      if (error) throw error

      toast.success(`Re-embedded "${docTitle}" with enriched vectors`)
      void fetchData(true)
    } catch (err) {
      console.error("Re-embed failed:", err)
      toast.error("Failed to re-embed document")
    } finally {
      setReembeddingDoc(null)
    }
  }

  // Filtering logs/submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      s.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      s.message.toLowerCase().includes(inquirySearch.toLowerCase())

    const matchesFilter = inquiryFilter === "all" || s.status === inquiryFilter
    return matchesSearch && matchesFilter
  })

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(postSearch.toLowerCase())
  )

  const filteredDocs = docs?.filter((d) =>
    d.title.toLowerCase().includes(docSearch.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center font-mono text-arra-cyan">
        <Loader2 className="mb-4 size-8 animate-spin text-arra-cyan" />
        <p className="animate-pulse text-xs tracking-[0.2em] uppercase">
          SYNCHRONIZING SECURE CORE...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full flex-1 select-text">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        {/* 1. OVERVIEW PANEL */}
        <TabsContent
          value="overview"
          className="mt-0 focus-visible:outline-none"
        >
          <AdminToday
            submissions={submissions}
            posts={posts}
            documents={docs}
            onNavigate={handleTabChange}
            onOpenInquiry={(submission) => {
              setSelectedSubmission(
                submissions.find((item) => item.id === submission.id) ?? null
              )
              handleTabChange("inquiries")
            }}
          />
        </TabsContent>

        {/* 2. CONTACT INQUIRIES TAB */}
        <TabsContent
          value="inquiries"
          className="mx-auto max-w-7xl space-y-6 px-4 py-8 focus-visible:outline-none md:px-6 lg:py-10"
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {/* List View */}
            <div className="space-y-4 lg:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-foreground/40" />
                  <Input
                    placeholder="Search messages, names, email..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    className="h-10 rounded-none border-border/80 bg-background pl-9 font-mono text-xs dark:border-border/40 dark:bg-background/50"
                  />
                </div>
                <div className="flex gap-2">
                  {(["all", "new", "read", "archived"] as const).map(
                    (filter) => (
                      <button
                        key={filter}
                        onClick={() => setInquiryFilter(filter)}
                        className={`rounded-none border px-3 py-1 font-mono text-xs tracking-wider uppercase transition-all ${
                          inquiryFilter === filter
                            ? "border-foreground bg-foreground font-bold text-background"
                            : "border-border/80 text-foreground/60 hover:bg-muted hover:text-foreground dark:border-border/40"
                        }`}
                      >
                        {filter}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="no-scrollbar max-h-[480px] divide-y divide-border/30 overflow-y-auto border border-border bg-card">
                {filteredSubmissions.length === 0 ? (
                  <div className="p-8 text-center font-mono text-xs text-foreground/40">
                    No inquiries match this view.
                  </div>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubmission(sub)}
                      className={`relative flex cursor-pointer items-center justify-between p-4 text-left transition-colors ${
                        selectedSubmission?.id === sub.id
                          ? "bg-secondary text-primary"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex-1 space-y-1 truncate pr-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-1.5 w-1.5 rounded-none ${
                              sub.status === "new"
                                ? "bg-arra-ochre"
                                : sub.status === "read"
                                  ? "bg-muted-foreground/30"
                                  : "bg-muted-foreground/60"
                            }`}
                          ></span>
                          <span className="max-w-[150px] truncate text-xs font-bold">
                            {sub.name}
                          </span>
                          <span className="max-w-[200px] truncate font-mono text-[10px] text-foreground/40">
                            &lt;{sub.email}&gt;
                          </span>
                        </div>
                        <p className="truncate font-mono text-[11px] text-foreground/60">
                          {sub.message}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="border border-border bg-background/50 px-2 py-0.5 font-mono text-[9px] tracking-wider text-foreground/50 uppercase">
                          {sub.intent}
                        </span>
                        <span className="font-mono text-[10px] text-foreground/40">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Inquiry Details Panel */}
            <div className="border border-border bg-card p-6">
              <div>
                {selectedSubmission ? (
                  <div
                    key={selectedSubmission.id}
                    className="space-y-6 animate-in fade-in duration-200"
                  >
                    <div className="space-y-2 border-b border-border pb-4">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2.5 py-0.5 font-mono text-[9px] tracking-widest uppercase ${
                            selectedSubmission.status === "new"
                              ? "border border-arra-ochre/30 bg-arra-ochre/10 text-arra-ochre"
                              : selectedSubmission.status === "read"
                                ? "border border-border bg-muted text-muted-foreground"
                                : "border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {selectedSubmission.status} STATUS
                        </span>
                        <span className="font-mono text-[10px] text-foreground/40">
                          {new Date(
                            selectedSubmission.created_at
                          ).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="font-heading text-base font-bold">
                        {selectedSubmission.name}
                      </h3>
                      <p className="font-mono text-xs text-foreground/60">
                        {selectedSubmission.email}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] tracking-widest text-foreground/40 uppercase">
                          Intent
                        </span>
                        <p className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
                          {selectedSubmission.intent}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="font-mono text-[9px] tracking-widest text-foreground/40 uppercase">
                          Message
                        </span>
                        <div className="min-h-[140px] border border-border bg-muted/30 p-4 font-sans text-sm leading-7 whitespace-pre-wrap">
                          {selectedSubmission.message}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 border-t border-border pt-4">
                      {selectedSubmission.status !== "read" && (
                        <Button
                          onClick={() =>
                            updateSubmissionStatus(
                              selectedSubmission.id,
                              "read"
                            )
                          }
                          variant="ghost"
                          className="h-10 rounded-none border border-border font-mono text-xs"
                        >
                          <Check className="mr-2 size-3.5 text-green-400" />
                          Mark Read
                        </Button>
                      )}
                      {selectedSubmission.status !== "archived" && (
                        <Button
                          onClick={() =>
                            updateSubmissionStatus(
                              selectedSubmission.id,
                              "archived"
                            )
                          }
                          variant="ghost"
                          className="h-10 rounded-none border border-border font-mono text-xs"
                        >
                          <Archive className="mr-2 size-3.5 text-amber-400" />
                          Archive
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteSubmission(selectedSubmission.id)}
                        variant="ghost"
                        className="col-span-2 mt-1 h-10 rounded-none border border-red-500/20 font-mono text-xs text-red-400 hover:bg-red-950/20"
                      >
                        <Trash2 className="mr-2 size-3.5" />
                        Scrub Record
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-8 py-20 text-center font-mono text-xs text-foreground/40">
                    <Eye className="mb-3 size-8 opacity-30" />
                    Select an inquiry to review its details and next action.
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 3. BLOG CMS TAB */}
        <TabsContent
          value="cms"
          className="mx-auto max-w-7xl space-y-6 px-4 py-8 focus-visible:outline-none md:px-6 lg:py-10"
        >
          <div className="grid animate-in gap-6 duration-300 fade-in lg:grid-cols-3">
            {/* Form Column */}
            <div className="space-y-4 border border-border bg-card p-6 lg:col-span-1">
              <div>
                <h3 className="font-serif text-2xl text-foreground">
                  {editingPost ? "Edit field note" : "Create field note"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Shape a measured research note, then publish it when the
                  evidence is ready.
                </p>
              </div>

              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="postTitle"
                    className="font-mono text-xs tracking-widest text-foreground/60 uppercase"
                  >
                    Title
                  </label>
                  <Input
                    id="postTitle"
                    value={postTitle}
                    onChange={(e) => {
                      setPostTitle(e.target.value)
                      if (!editingPost) {
                        setPostSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "")
                        )
                      }
                    }}
                    placeholder="Article title..."
                    className="h-10 rounded-none border-border/80 bg-background font-mono text-xs dark:border-border/40 dark:bg-background/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="postSlug"
                    className="font-mono text-xs tracking-widest text-foreground/60 uppercase"
                  >
                    Slug URL
                  </label>
                  <Input
                    id="postSlug"
                    value={postSlug}
                    onChange={(e) => setPostSlug(e.target.value)}
                    placeholder="e.g. continuous-context"
                    className="h-10 rounded-none border-border/80 bg-background font-mono text-xs dark:border-border/40 dark:bg-background/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="postExcerpt"
                    className="font-mono text-xs tracking-widest text-foreground/60 uppercase"
                  >
                    Excerpt / Short Description
                  </label>
                  <Input
                    id="postExcerpt"
                    value={postExcerpt}
                    onChange={(e) => setPostExcerpt(e.target.value)}
                    placeholder="A brief summary for previews..."
                    className="h-10 rounded-none border-border/80 bg-background font-mono text-xs dark:border-border/40 dark:bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="postContent"
                    className="font-mono text-xs tracking-widest text-foreground/60 uppercase"
                  >
                    Body Content
                  </label>
                  <RichTextEditor
                    value={postContent}
                    onChange={setPostContent}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="postStatus"
                    className="font-mono text-xs tracking-widest text-foreground/60 uppercase"
                  >
                    Publication Status
                  </label>
                  <Select value={postStatus} onValueChange={setPostStatus}>
                    <SelectTrigger className="h-10 w-full rounded-none border-border/80 bg-background font-mono text-xs text-foreground focus-visible:ring-1 focus-visible:ring-arra-cyan/50 dark:border-border/40 dark:bg-background/50">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none font-mono">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  {editingPost && (
                    <Button
                      type="button"
                      onClick={() => {
                        setEditingPost(null)
                        setPostTitle("")
                        setPostSlug("")
                        setPostExcerpt("")
                        setPostContent("")
                        setPostStatus("draft")
                      }}
                      variant="ghost"
                      className="flex-1 rounded-none border border-border font-mono text-xs"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="h-10 flex-1 rounded-none bg-primary font-mono text-xs font-bold text-primary-foreground uppercase hover:bg-primary/90"
                    disabled={cmsLoading}
                  >
                    {cmsLoading
                      ? "Saving..."
                      : editingPost
                        ? "Update field note"
                        : "Create field note"}
                  </Button>
                </div>
              </form>
            </div>

            {/* List Column */}
            <div className="space-y-4 border border-border bg-card p-6 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-serif text-2xl text-foreground">
                    Field-note directory
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Review drafts and published writing from one clear index.
                  </p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-foreground/40" />
                  <Input
                    placeholder="Search posts..."
                    value={postSearch}
                    onChange={(e) => setPostSearch(e.target.value)}
                    className="h-9 rounded-none border-border/80 bg-background pl-9 font-mono text-xs dark:border-border/40 dark:bg-background/50"
                  />
                </div>
              </div>

              <div className="no-scrollbar max-h-[460px] divide-y divide-border overflow-y-auto border border-border bg-background">
                {filteredPosts.length === 0 ? (
                  <div className="p-8 text-center font-mono text-xs text-foreground/40">
                    No field notes yet. Create a draft when the first
                    observation is ready.
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex-1 space-y-1 truncate pr-4">
                        <div className="flex items-center gap-2">
                          <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                          <p className="truncate font-mono text-xs font-bold text-foreground">
                            {post.title}
                          </p>
                          <span
                            className={`border px-1.5 py-0.25 font-mono text-[8px] tracking-wider uppercase ${
                              post.status === "published"
                                ? "border-emerald-500/30 bg-emerald-950/10 text-emerald-400"
                                : "border-border/60 bg-black/20 text-foreground/50"
                            }`}
                          >
                            {post.status}
                          </span>
                        </div>
                        <p className="truncate font-mono text-[10px] text-foreground/40">
                          slug: /{post.slug} · Created:{" "}
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            setEditingPost(post)
                            setPostTitle(post.title)
                            setPostSlug(post.slug)
                            setPostExcerpt(post.excerpt || "")
                            setPostContent(post.content)
                            setPostStatus(post.status)
                          }}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-none text-muted-foreground hover:bg-muted hover:text-primary"
                        >
                          <FileEdit className="size-3.5" />
                        </Button>
                        <Button
                          onClick={() => deletePost(post.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-none text-foreground/40 hover:bg-red-950/20 hover:text-red-400"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 4. KNOWLEDGE NET TAB */}
        <TabsContent
          value="knowledge"
          className="mx-auto max-w-7xl space-y-6 px-4 py-8 focus-visible:outline-none md:px-6 lg:py-10"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {/* Form Column */}
            <div className="space-y-4 border border-border bg-card p-6 md:col-span-1">
              <div>
                <h3 className="font-serif text-2xl text-foreground">
                  Add a source
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Add verified source material to ARRA&apos;s internal research
                  knowledge base.
                </p>
              </div>

              <form onSubmit={handleIngestSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="font-mono text-xs tracking-widest text-foreground/60 uppercase"
                  >
                    Document Title
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Protocol 7 Specifications"
                    className="h-10 rounded-none border-border/80 bg-background text-xs dark:border-border/40 dark:bg-background/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="content"
                    className="font-mono text-xs tracking-widest text-foreground/60 uppercase"
                  >
                    Raw Content
                  </label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste documentation, lore, or factual data here..."
                    className="min-h-[220px] rounded-none border-border/80 bg-background font-mono text-xs leading-relaxed dark:border-border/40 dark:bg-background/50"
                    required
                  />
                </div>

                {ingestStatus === "success" && (
                  <div className="flex items-center gap-2 border border-green-500/30 bg-green-950/20 p-3 font-mono text-[10px] text-green-400">
                    <CheckCircle2 className="size-4 shrink-0" />
                    DATA INGESTED AND EMBEDDED SUCCESSFULLY.
                  </div>
                )}
                {ingestStatus === "error" && (
                  <div className="border border-red-500/30 bg-red-950/20 p-3 font-mono text-[10px] text-red-400">
                    INGESTION PIPELINE ERROR. CHECK TELEMETRY LOGS.
                  </div>
                )}

                <Button
                  type="submit"
                  className="h-11 w-full rounded-none bg-primary font-mono text-xs font-bold tracking-widest text-primary-foreground uppercase hover:bg-primary/90"
                  disabled={ingestLoading || !title || !content}
                >
                  {ingestLoading ? (
                    <>
                      <Loader2 className="mr-2 size-3.5 animate-spin" />
                      Generating Vectors...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 size-3.5" />
                      Add source
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* List Column */}
            <div className="space-y-4 border border-border bg-card p-6 md:col-span-2">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-serif text-2xl text-foreground">
                    Knowledge directory
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Source documents currently available to ARRA&apos;s research
                    assistant.
                  </p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-foreground/40" />
                  <Input
                    placeholder="Search documents..."
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    className="h-9 rounded-none border-border/80 bg-background pl-9 font-mono text-xs dark:border-border/40 dark:bg-background/50"
                  />
                </div>
              </div>

              <div className="no-scrollbar max-h-[460px] divide-y divide-border overflow-y-auto border border-border bg-background">
                {!filteredDocs ? (
                  <div className="p-8 text-center font-mono text-xs text-foreground/40">
                    <Loader2 className="mx-auto mb-2 size-4 animate-spin text-foreground/40" />
                    FETCHING VECTOR DIRECTORY...
                  </div>
                ) : filteredDocs.length === 0 ? (
                  <div className="p-8 text-center font-mono text-xs text-foreground/40">
                    No source documents have been added yet.
                  </div>
                ) : (
                  filteredDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex-1 space-y-1 truncate pr-4">
                        <div className="flex items-center gap-2">
                          <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                          <p className="truncate font-mono text-xs font-bold text-foreground">
                            {doc.title}
                          </p>
                        </div>
                        <p className="font-mono text-[10px] text-foreground/40">
                          {doc.chunks} vector{" "}
                          {doc.chunks === 1 ? "chunk" : "chunks"} · Created:{" "}
                          {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          onClick={() => handleReembedDoc(doc.title)}
                          variant="ghost"
                          size="icon"
                          title="Re-embed with enriched vectors"
                          className="h-8 w-8 rounded-none text-foreground/40 hover:bg-primary/10 hover:text-primary"
                          disabled={reembeddingDoc === doc.title || purgingDoc === doc.title}
                        >
                          {reembeddingDoc === doc.title ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="size-3.5" />
                          )}
                        </Button>
                        <Button
                          onClick={() => handlePurgeDoc(doc.title)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none text-foreground/40 hover:bg-red-950/20 hover:text-red-400"
                          disabled={purgingDoc === doc.title || reembeddingDoc === doc.title}
                        >
                          {purgingDoc === doc.title ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        {/* 5. SYSTEM SETTINGS TAB */}
        <TabsContent
          value="settings"
          className="mx-auto max-w-7xl space-y-6 px-4 py-8 focus-visible:outline-none md:px-6 lg:py-10"
        >
          <AdminSettings
            inquiryCount={submissions.length}
            postCount={posts.length}
            documentCount={docs?.length ?? 0}
          />
        </TabsContent>

        {/* 6. SUPPORT & GUIDE TAB */}
        <TabsContent
          value="support"
          className="mx-auto max-w-7xl space-y-6 px-4 py-8 focus-visible:outline-none md:px-6 lg:py-10"
        >
          <div className="animate-in space-y-6 overflow-hidden border border-border bg-card p-6">
            <div className="flex items-center gap-2 border-b border-border/20 pb-3">
              <HelpCircle className="size-4 text-muted-foreground" />
              <h3 className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
                System Help & Operator Manual
              </h3>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-serif text-lg font-semibold text-foreground">
                  Operator Keyboard Shortcuts
                </h4>
                <div className="space-y-2.5 font-mono text-xs text-foreground/75">
                  <div className="flex items-center justify-between border-b border-border/10 py-1.5">
                    <span>Toggle Dashboard View</span>
                    <kbd className="rounded-sm border border-border bg-muted px-1.5 py-0.5 text-[10px]">
                      Ctrl + Shift + A
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/10 py-1.5">
                    <span>Quick Core Sync</span>
                    <kbd className="rounded-sm border border-border bg-muted px-1.5 py-0.5 text-[10px]">
                      S
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/10 py-1.5">
                    <span>Cycle Navigation Tabs</span>
                    <kbd className="rounded-sm border border-border bg-muted px-1.5 py-0.5 text-[10px]">
                      Tab
                    </kbd>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-serif text-lg font-semibold text-foreground">
                  System Diagnostics Guide
                </h4>
                <p className="font-mono text-xs leading-relaxed text-foreground/60">
                  If the Telemetry logs report a connection timeout (ENOTFOUND
                  or similar), verify local network firewall permissions.
                  Supabase real-time channels use WebSockets (WSS) and require
                  outbound TCP connections on port 443. Database ingestion
                  vectors run asynchronously via Supabase Edge Functions.
                  Ingestion errors are usually logged in the telemetry terminal.
                </p>
                <div className="border border-amber-500/20 bg-amber-950/10 p-3 font-mono text-[10px] text-amber-600 dark:text-amber-400/80">
                  Emergency Command: If the console hangs, trigger "Sync Core"
                  from the header actions bar to re-establish secure socket
                  pipes.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
