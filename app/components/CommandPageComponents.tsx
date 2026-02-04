import type { ComponentProps, ReactNode, ReactElement } from 'react'
import { Children, isValidElement, cloneElement } from 'react'

// Custom H1 for command pages - adds terminal prompt icon
export function CommandH1({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6 mt-0">
      <span className="text-emerald-500 dark:text-emerald-400 font-mono text-xl">&gt;_</span>
      <h1 className="text-3xl font-bold m-0 p-0">{children}</h1>
    </div>
  )
}

// Custom strong/bold for options - styles them as green pills
export function CommandStrong({ children }: ComponentProps<'strong'>) {
  const text = String(children)

  // Check if this looks like option syntax with Usage:
  if (text.includes('Usage:')) {
    return <strong>{children}</strong>
  }

  return <strong>{children}</strong>
}

// Helper to check if content looks like an option/argument
function isOptionOrArgument(text: string): boolean {
  return (
    text.startsWith('-') ||
    text.includes('--') ||
    text.startsWith('<') && text.endsWith('>') ||
    text.match(/^-[a-z],\s+--[a-z-]+/i) !== null
  )
}

// Custom code for inline code - adds green background for options
export function CommandCode({ children, className, ...props }: ComponentProps<'code'>) {
  // If it's in a pre tag (code block), don't style it
  if (className?.includes('language-')) {
    return <code className={className} {...props}>{children}</code>
  }

  // Check if this looks like an option flag or argument
  const text = String(children)

  if (isOptionOrArgument(text)) {
    return (
      <code
        className="inline-block px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded font-mono text-sm whitespace-nowrap not-prose"
        {...props}
      >
        {children}
      </code>
    )
  }

  return <code className={className} {...props}>{children}</code>
}

// Custom list item for options/arguments
export function CommandLi({ children, ...props }: ComponentProps<'li'>) {
  // Process children to find code elements
  let hasOptionCode = false

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === 'code') {
      const childProps = child.props as any
      const text = String(childProps.children || '')
      if (isOptionOrArgument(text)) {
        hasOptionCode = true
      }
    }
  })

  if (hasOptionCode) {
    return (
      <li className="flex items-start gap-3 my-3 list-none" {...props}>
        <div className="flex items-start gap-3 w-full">{children}</div>
      </li>
    )
  }

  return <li {...props}>{children}</li>
}

// Custom unordered list
export function CommandUl({ children, ...props }: ComponentProps<'ul'>) {
  return <ul className="space-y-1" {...props}>{children}</ul>
}

// Wrapper to detect command pages and apply custom styling
export function getCommandPageComponents(isCommandPage: boolean): Record<string, any> {
  if (!isCommandPage) {
    return {}
  }

  return {
    h1: CommandH1,
    code: CommandCode,
    li: CommandLi,
    ul: CommandUl,
    strong: CommandStrong,
  } as Record<string, any>
}
