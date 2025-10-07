interface ResizableIframeProps {
  src: string
  title: string
  sandbox: string
  className?: string
  fixedHeight?: string
}

export default function ResizableIframe({ src, title, sandbox, className, fixedHeight }: ResizableIframeProps) {
  const height = fixedHeight || '200px'
  const minHeight = fixedHeight ? undefined : '200px'

  return (
    <iframe
      src={src}
      className={className}
      style={{ height, minHeight }}
      title={title}
      sandbox={sandbox}
    />
  )
}