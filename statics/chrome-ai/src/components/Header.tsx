export default function Header() {
  return (
    <div className="col-span-full flex items-start justify-between gap-1">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="font-cal text-3xl">
          Device Model: Chrome AI Gemini Nano
        </h1>
        <p className="text-muted-foreground">
          Running large language models locally in the browser. Made by{' '}
          <a
            href="https://edgeone.ai"
            target="_blank"
            className="font-medium text-primary underline underline-offset-4"
          >
            edgeone.ai
          </a>
          {'. '}
          Open source on{' '}
          <a
            href="https://github.com/TencentEdgeOne/templates"
            target="_blank"
            className="font-medium text-primary underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
