import { readdir, readFile, writeFile } from "node:fs/promises"

const CONTENT_DIR = "./content/docs"

function toTitleCase(str) {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

let fileContent = []
let filePaths = {}

try {
  const files = await readdir(CONTENT_DIR, {
    recursive: true,
    withFileTypes: true
  })
  // fileContent = await Promise.all(
  //   files
  //     .map((file) => {
  //       if (
  //         file.isFile() &&
  //         file.name.includes("mdx") &&
  //         !file.parentPath.includes("api-reference")
  //       ) {
  //         console.log("file:", file)
  //         return readFile(`${file.parentPath}/${file.name}`)
  //       }
  //     })
  //     .filter(Boolean)
  // )

  // for await (const file of files) {
  for (const file of files) {
    if (file.isFile() && file.name.includes("mdx") && !file.parentPath.includes("api-reference")) {
      console.log("file:", file)
      // console.log("reading file:", file)
      filePaths[file.name] = `${file.parentPath}/${file.name}`
      // fileContent.push(await readFile(`${file.parentPath}/${file.name}`))
    }
  }
  fileContent = `
# GitButler Documentation

## Docs 

${Object.entries(filePaths).map((file) => {
  return `- [${file[0]}](${file[1].replace("content/docs", "").replace(".mdx", "").replace("./", "")})\n`
})}`
} catch (err) {
  console.error("Error reading files", err)
}

// const mergedMarkdown = fileContent

await Promise.all(
  Object.entries(filePaths).map(async (file) => {
    // const fileContents = await readFile(`${file[1]}/${file[0]}`)
    let fileContents = (await readFile(`${file[1]}`)).toString()
    fileContents = fileContents.replace(/---.*---\n/s, "")
    fileContents = fileContents.replace(/import .*\n/g, "")

    fileContent += `\n\n# ${file[0]}`
    fileContent += `\n${fileContents}`

    // console.log("content:", fileContents)
  })
)
console.log("FILECONTENT:", fileContent)

await writeFile("./public/llms.txt", fileContent)
