export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
        The fastest way to build user authentication with Supabase on EdgeOne Pages
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
        Get started with Supabase authentication in minutes. Secure, scalable, and easy to implement.
      </p>
      {/* <div className="flex gap-4 mt-8">
        <Button size="lg">Deploy Your App</Button>
        <Button size="lg" variant="outline">Documentation</Button>
      </div> */}
    </div>
  );
} 