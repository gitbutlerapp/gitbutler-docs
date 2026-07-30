import { readdir, readFile, writeFile } from "node:fs/promises"
import { relative } from "node:path"

const CONTENT_DIR = "./content/docs"

const filePaths = (
  await readdir(CONTENT_DIR, {
    recursive: true,
    withFileTypes: true
  })
)
  .filter(
    (file) =>
      file.isFile() && file.name.endsWith(".mdx") && !file.parentPath.includes("api-reference")
  )
  .map((file) => `${file.parentPath}/${file.name}`)
  .sort()

const pages = await Promise.all(
  filePaths.map(async (filePath) => {
    let contents = (await readFile(filePath)).toString()
    contents = contents.replace(/^---\n[\s\S]*?\n---\n?/, "")
    contents = contents.replace(/^import .*\n/gm, "")

    const section = relative(CONTENT_DIR, filePath).slice(0, -4).replaceAll("/", "-")
    return { section, contents }
  })
)

let fileContent = `
# GitButler Documentation

## Table of Contents

${pages.map(({ section }) => `- [${section}](#${section})`).join("\n")}
${pages.map(({ section, contents }) => `\n\n# ${section}\n${contents}`).join("")}`

fileContent = fileContent
  .split("\n")
  .map((line) => line.replace(/[ \t]+$/, ""))
  .join("\n")

await writeFile("./public/llms-full.txt", fileContent)
