// /app/login/page.tsx
import LoginFormWrapper from "@/components/Login/LoginFormWrapper"
import { Suspense } from "react"

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <LoginFormWrapper />
    </Suspense>
  )
}
