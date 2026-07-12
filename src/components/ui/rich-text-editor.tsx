import { useEditor, EditorContent, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

const ToggleButton = ({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "p-2 text-foreground/60 hover:bg-muted/50 hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed outline-none",
      active && "bg-muted text-foreground"
    )}
  >
    {children}
  </button>
)

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border/80 dark:border-border/40 p-1 bg-background/50">
      <ToggleButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <Bold className="size-3.5" />
      </ToggleButton>
      <ToggleButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <Italic className="size-3.5" />
      </ToggleButton>
      <ToggleButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
      >
        <Strikethrough className="size-3.5" />
      </ToggleButton>

      <div className="w-[1px] h-4 bg-border/50 mx-1.5" />

      <ToggleButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
      >
        <Heading1 className="size-3.5" />
      </ToggleButton>
      <ToggleButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
      >
        <Heading2 className="size-3.5" />
      </ToggleButton>

      <div className="w-[1px] h-4 bg-border/50 mx-1.5" />

      <ToggleButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        <List className="size-3.5" />
      </ToggleButton>
      <ToggleButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        <ListOrdered className="size-3.5" />
      </ToggleButton>
      <ToggleButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      >
        <Quote className="size-3.5" />
      </ToggleButton>

      <div className="w-[1px] h-4 bg-border/50 mx-1.5" />

      <ToggleButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        active={false}
      >
        <Undo className="size-3.5" />
      </ToggleButton>
      <ToggleButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        active={false}
      >
        <Redo className="size-3.5" />
      </ToggleButton>
    </div>
  )
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[220px] p-4 font-sans text-xs leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  return (
    <div className="rounded-none border border-border/80 dark:border-border/40 bg-background flex flex-col focus-within:ring-1 focus-within:ring-arra-cyan/50 transition-shadow">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="flex-1 cursor-text" onClick={() => editor?.commands.focus()} />
    </div>
  )
}
