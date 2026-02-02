import { utils } from "@/app/source"
import type { DocsLayoutProps } from "fumadocs-ui/layouts/docs"
import type { HomeLayoutProps } from "fumadocs-ui/layouts/home"

import Logo from "@/components/Logo"
import Discord from "@/components/logos/discord"
import GitButler from "@/components/logos/gitbutler-wordmark"

// Strip backticks from page tree titles
function stripBackticksFromTree(tree: any): any {
  return {
    ...tree,
    name: tree.name.replace(/`/g, ''),
    children: tree.children?.map((child: any) => stripBackticksFromTree(child))
  }
}

// shared configuration
export const baseOptions: HomeLayoutProps = {
  nav: {
    title: <Logo />,
    transparentMode: "top"
  },
  githubUrl: "https://github.com/gitbutlerapp/gitbutler",
  links: [
    {
      icon: <Discord />,
      text: "Discord",
      url: "https://discord.com/invite/MmFkmaJ42D"
    },
    {
      icon: <GitButler />,
      text: "GitButler Cloud",
      url: "https://app.gitbutler.com/"
    }
  ]
}

// docs layout configuration
export const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  sidebar: {
    defaultOpenLevel: 0
  },
  tree: stripBackticksFromTree(utils.pageTree)
}
