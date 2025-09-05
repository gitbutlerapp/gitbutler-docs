import { ImageZoom } from "fumadocs-ui/components/image-zoom"

interface Props {
  /**
   * Image path relative to `/public/img/docs` or a remote URL
   */
  src: string
  alt?: string
  className?: string
  subtitle?: string
  width?: number
  height?: number
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str)

export default async function ImageSection({
  src,
  alt,
  subtitle,
  width: propWidth,
  height: propHeight
}: Props) {
  let img: string | { src: string; width: number; height: number } | undefined = undefined
  let width = propWidth ?? 600 // default width for remote images
  let height = propHeight ?? 400 // default height for remote images
  const isRemote = src.startsWith("http://") || src.startsWith("https://")

  if (isRemote) {
    // Replace S3 URLs with CloudFront URLs
    img = src.replace('gitbutler-docs-images-public.s3.us-east-1.amazonaws.com', 'd2m1ukvwmu7gz4.cloudfront.net')
    if (!propWidth || !propHeight) {
      throw new Error(`Remote image with src "${src}" requires explicit width and height props.`)
    }
    width = propWidth
    height = propHeight
  } else {
    img = await import(`../../public/img/docs${src}`).then((mod) => mod.default)
    if (!img) return null
    if (typeof img !== "string") {
      width = img.width
      height = img.height
    }
  }

  return (
    <div className="mx-auto mb-4 flex flex-col justify-start rounded-lg border border-neutral-200 bg-neutral-100 p-2 dark:border-neutral-800 dark:bg-neutral-900 [&>span]:w-fit [&_img]:m-0">
      <ImageZoom
        className="rounded-md"
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
        alt={alt ?? subtitle ?? ""}
        src={img}
        width={width}
        height={height}
      />
      {subtitle ? (
        <div className="mx-auto mt-2 flex-shrink whitespace-normal text-pretty break-words text-center text-xs opacity-50">
          {subtitle}
        </div>
      ) : null}
    </div>
  )
}
