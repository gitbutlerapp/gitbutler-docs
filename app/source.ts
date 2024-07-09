import { map } from "@/.map"
import { createMDXSource } from "fumadocs-mdx"
import { loader } from "fumadocs-core/source"

export const { getPage, getPages, pageTree, files } = loader({
  baseUrl: "/",
  rootDir: "docs",
  transformers: [
    async ({ storage }) => {
      const releasesFile = storage.files.get("releases/releases.page")
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

      const newContent = releasesFile.data.data.exports.structuredData.contents

      newContent.splice(1, 0, {
        heading: `v${latestRelease.name.replace("release/", "")}`,
        content: latestRelease.body
      })
      // newContent.splice(1, 0, {
      //   heading: `v111`,
      //   content: "NEW CONTENT!"
      // })
      releasesFile.data.data.exports.structuredData.contents = newContent

      console.log("Updated releases file", JSON.stringify(releasesFile, null, 2))
      // data.storage.files.set("releases.page", releasesFile)
      storage.write("releases.mdx", "page", releasesFile.data)

      // Debug
      const releasesFile2 = storage.files.get("releases.page")
      console.log("releaseFile2", JSON.stringify(releasesFile2, null, 2))
    }
  ],
  source: createMDXSource(map)
})
