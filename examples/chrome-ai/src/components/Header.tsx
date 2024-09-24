export default function Header() {
  return (
    <div className="flex items-start justify-between gap-1 col-span-full">
      <div className="flex flex-col min-w-0 gap-1">
        <h1 className="text-3xl font-cal">
          Device Model: Chrome AI Gemini Nano
        </h1>
        <p className="text-muted-foreground">
          Running large language models locally in the browser.
          <br />
          Deploy on{' '}
          <a
            href="https://edgeone.ai/products/pages"
            target="_blank"
            className="font-medium underline text-primary underline-offset-4"
          >
            EdgeOne Pages
          </a>
          {'. '}
          Open source on{' '}
          <a
            href="https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/chrome-ai"
            target="_blank"
            className="font-medium underline text-primary underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
