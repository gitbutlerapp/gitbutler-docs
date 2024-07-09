import { map } from "@/.map"
import { createMDXSource } from "fumadocs-mdx"
import { loader } from "fumadocs-core/source"

export const { getPage, getPages, pageTree, files } = loader({
  baseUrl: "/",
  rootDir: "docs",
  transformers: [
    async ({ storage }) => {
      const releasesFile = storage.files.get("releases.page")
      if (!releasesFile) {
        console.log("No releases file found")
        return
      }

      // Fetch latest release from GitHub
      const ghResponse = await fetch(
        "https://api.github.com/repos/gitbutlerapp/gitbutler/releases/latest"
      )
      if (!ghResponse.ok) {
        console.log(`Failed to fetch latest release: ${ghResponse.statusText}`)
        return
      }

      const ghResponsePayload = await ghResponse.json()
      const latestRelease = Array.isArray(ghResponsePayload)
        ? ghResponsePayload[0]
        : ghResponsePayload

      if (latestRelease.draft || latestRelease.prerelease) {
        console.log("Latest release is a draft or prerelease, skipping update")
        return
      }

      // HACKY WAY
      // @ts-expect-error TODO type data
      const newContent = releasesFile.data.data.exports.structuredData.contents
      newContent.splice(1, 0, {
        heading: `v${latestRelease.name.replace("release/", "")}`,
        content: `${latestRelease.body}\n\n---\n`
      })
      // TODO: This hack works, but it's not using their VFS APIs :thinking:
      // @ts-expect-error TODO type data
      releasesFile.data.data.exports.default = newContent
        .map((item: { heading: string; content: string }) => {
          let output = ""
          if (item.heading) {
            output = `### ${item.heading}`
          }
          output += `\n\n${item.content}`
          return output
        })
        .join("\n\n")

      // REAL WAY
      // // @ts-expect-error TODO type data
      // const newContent = releasesFile.data.data.exports.structuredData.contents
      // newContent.splice(1, 0, {
      //   heading: `v${latestRelease.name.replace("release/", "")}`,
      //   content: latestRelease.body
      // })
      // // @ts-expect-error TODO type data
      // releasesFile.data.data.exports.structuredData.contents = newContent
      //
      // storage.write("releases.mdx", "page", releasesFile.data)
    }
  ],
  source: createMDXSource(map)
})
