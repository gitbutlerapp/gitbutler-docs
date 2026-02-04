import fs from "fs"
import path from "path"
import type { Metadata } from "next"
import type { CheatSheet } from "@/types/cheat"
import { MermaidInit } from "./mermaid-init"
import { CheatSheetContent } from "./cheat-sheet-content"

export const metadata: Metadata = {
  title: "GitButler CLI Cheat Sheet",
  description: "Essential commands for working with GitButler CLI"
}

function getCheatSheetData(): CheatSheet {
  const filePath = path.join(process.cwd(), "content", "cheat.json")
  const fileContents = fs.readFileSync(filePath, "utf8")
  return JSON.parse(fileContents)
}

export default async function CheatSheetPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>
}) {
  const cheatSheet = getCheatSheetData()
  const params = await searchParams
  const initialLevel = params.level === 'all' ? 'all' : 'basic'

  return (
    <>
      <MermaidInit />
      <div className="min-h-screen">
        <CheatSheetContent cheatSheet={cheatSheet} initialLevel={initialLevel} />
      </div>
    </>
  )
}
