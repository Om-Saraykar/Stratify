import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useAuth } from "@/context/AuthContext";

export default function IndexPage() {
  const { isLoggedIn } = useAuth();

  return (
    <DefaultLayout>
      <section className="flex flex-1 flex-col items-center justify-center text-center gap-6 h-full">
        <div className="max-w-lg">
          <h1>
            <span className={title()}>Welcome to&nbsp;</span>
            <span className={title({ color: "violet" })}>Stratify</span>
            <br />
            <span className={title()}>Your AI Notes Companion</span>
          </h1>
          <div className={subtitle({ class: "mt-4" })}>
            Automatically classify, organize, and search your notes with the
            power of AI.
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          {!isLoggedIn && (
            <Link
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
              })}
              href="/login"
            >
              Get Started
            </Link>
          )}
          <Link
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href="/about"
          >
            Learn More
          </Link>
        </div>

        <div className="mt-8 text-center text-lg text-default-500 max-w-md">
          Let Stratify bring structure to your thoughts. Capture freely — we’ll
          organize it intelligently.
        </div>
      </section>
    </DefaultLayout>
  );
}
