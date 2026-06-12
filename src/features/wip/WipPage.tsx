import { Button } from '@/shared/ui';

export function WipPage() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_#deebff,_#f4f5f7_55%)] p-6 text-center">
      <h1 className="text-3xl font-semibold">Work in progress</h1>
      <p className="mt-3 max-w-xl text-[var(--color-text-medium)]">
        This route is intentionally preserved from the Angular app and will remain a standalone
        page.
      </p>
      <a href="/project/board" className="mt-6">
        <Button variant="primary">Back to board</Button>
      </a>
    </section>
  );
}
