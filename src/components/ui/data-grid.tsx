import { useState, useMemo } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Database } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DocItem {
  id?: string
  title: string
  chunks: number
  created_at: string
}

interface DataGridProps {
  docs: DocItem[]
}

type SortField = "title" | "chunks" | "created_at"
type SortOrder = "asc" | "desc"

export function DataGrid({ docs }: DataGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("title")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const filteredAndSortedDocs = useMemo(() => {
    const filtered = docs.filter((doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return filtered.sort((a, b) => {
      let valA = a[sortField]
      let valB = b[sortField]

      if (sortField === "created_at") {
        valA = new Date(a.created_at).getTime()
        valB = new Date(b.created_at).getTime()
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA)
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA
      }

      return 0
    })
  }, [docs, searchTerm, sortField, sortOrder])

  // Get max chunks for relative progress indicators
  const maxChunks = useMemo(() => {
    if (docs.length === 0) return 1
    return Math.max(...docs.map((d) => d.chunks), 1)
  }, [docs])

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 size-3.5 opacity-40" />
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 size-3.5 text-primary" />
    ) : (
      <ArrowDown className="ml-2 size-3.5 text-primary" />
    )
  }

  return (
    <div className="w-full space-y-4 border border-border bg-card p-6 rounded-none shadow-sm">
      {/* Top filter bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 text-primary">
          <Database className="size-4" />
          <span className="mono-label text-[9px] tracking-wider uppercase font-mono">VECTOR INDEX TELEMETRY</span>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Filter by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs font-mono h-9 bg-background/50 border-border focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Responsive table container */}
      <div className="overflow-x-auto border border-border/40 rounded-none bg-background/25">
        <table className="w-full text-left border-collapse font-mono text-[11px]">
          <thead>
            <tr className="border-b border-border/40 bg-background/50">
              <th className="p-3 font-semibold text-foreground/70">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("title")}
                  className="h-auto p-0 font-mono text-[11px] font-semibold text-foreground/70 hover:text-foreground hover:bg-transparent"
                >
                  DOCUMENT TITLE
                  {renderSortIcon("title")}
                </Button>
              </th>
              <th className="p-3 font-semibold text-foreground/70">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("chunks")}
                  className="h-auto p-0 font-mono text-[11px] font-semibold text-foreground/70 hover:text-foreground hover:bg-transparent"
                >
                  VECTOR CHUNKS
                  {renderSortIcon("chunks")}
                </Button>
              </th>
              <th className="p-3 font-semibold text-foreground/70">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("created_at")}
                  className="h-auto p-0 font-mono text-[11px] font-semibold text-foreground/70 hover:text-foreground hover:bg-transparent"
                >
                  INGRESS DATE
                  {renderSortIcon("created_at")}
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedDocs.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-muted-foreground italic">
                  No records matching the telemetry filter.
                </td>
              </tr>
            ) : (
              filteredAndSortedDocs.map((doc, idx) => (
                <tr
                  key={doc.id || doc.title || idx}
                  className="border-b border-border/10 hover:bg-arra-cyan/[0.02] transition-colors"
                >
                  <td className="p-3 font-medium text-foreground truncate max-w-xs" title={doc.title}>
                    {doc.title}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 font-bold text-arra-cyan">{doc.chunks} dim</span>
                      <div className="h-1.5 w-24 bg-border/20 rounded-none overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-arra-cyan transition-all duration-500"
                          style={{ width: `${(doc.chunks / maxChunks) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-foreground/60">
                    {new Date(doc.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Data footer */}
      <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
        <span>Showing {filteredAndSortedDocs.length} of {docs.length} assets</span>
        <span>Index active</span>
      </div>
    </div>
  )
}
