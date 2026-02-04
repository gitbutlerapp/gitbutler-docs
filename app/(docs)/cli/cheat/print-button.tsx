"use client"

import { useState, useRef, useEffect } from "react"

export function CheatSheetPrintButton() {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="flex gap-2 print:hidden">
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 rounded-md px-4 py-2 font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#1a8a89" }}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download PDF
        </button>

        {showMenu && (
          <div className="absolute right-0 z-10 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <a
              href="/gitbutler-cheat-sheet-basic.pdf"
              download
              className="block px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={() => setShowMenu(false)}
            >
              <div className="font-medium">Basic Commands</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Essential GitButler commands
              </div>
            </a>
            <a
              href="/gitbutler-cheat-sheet-all.pdf"
              download
              className="block border-t border-gray-200 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={() => setShowMenu(false)}
            >
              <div className="font-medium">All Commands</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Complete reference</div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
