import { lazy, Suspense } from "react"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import { RootLayout } from "@/layout/root-layout"
import Home from "@/pages/home"

const Products = lazy(() => import("@/pages/products"))
const About = lazy(() => import("@/pages/about"))
const Contact = lazy(() => import("@/pages/contact"))
const DebugPage = lazy(() => import("@/pages/debug"))
const AdminLayout = lazy(() =>
  import("@/layout/admin-layout").then((module) => ({ default: module.AdminLayout }))
)
const AdminLogin = lazy(() => import("@/pages/admin/login"))
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"))

// Dynamic blog page pulling articles from database
const Blog = lazy(() => import("@/pages/blog"))

const NotFound = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex min-h-[65vh] items-center py-20">
    <div className="max-w-xl">
      <p className="mono-label text-foreground/58">404</p>
      <h1 className="serif-display mt-5 text-5xl leading-none md:text-6xl">
        This page is outside the current field notes.
      </h1>
      <Link
        to="/"
        className="mt-8 inline-flex border-b border-foreground pb-1 text-sm font-semibold"
      >
        Return home
      </Link>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-background" aria-busy="true" />}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            {import.meta.env.DEV && (
              <Route path="/debug" element={<DebugPage />} />
            )}
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="login" element={<AdminLogin />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
