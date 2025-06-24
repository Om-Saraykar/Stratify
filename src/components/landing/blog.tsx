import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface Post {
  id: string;
  title: string;
  summary: string;
  label: string;
  author: string;
  published: string;
  url: string;
  image: string;
}

interface StratifyBlogProps {
  tagline?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  posts?: Post[];
}

const Blog7 = ({
  tagline = "Stratify Insights",
  heading = "Boost Your Productivity with AI",
  description = "Explore the science and strategy behind productivity, mental wellness, and note-taking. Learn how Stratify combines AI with journaling, task management, and intelligent workflows to help you perform at your best.",
  buttonText = "Explore all posts",
  buttonUrl = "/blog",
  posts = [
    {
      id: "post-1",
      title: "Mastering AI-Enhanced Note-Taking with Stratify",
      summary:
        "See how Stratify leverages AI to summarize, organize, and retrieve your notes in seconds — no more manual chaos.",
      label: "Notes",
      author: "Om Saraykar",
      published: "23 Jun 2025",
      url: "/blog/ai-notes",
      image: "/stratify-logo.png",
    },
    {
      id: "post-2",
      title: "Tame Your Task List: Task Management that Works",
      summary:
        "Turn your to-dos into done with Stratify’s intelligent task planner and daily productivity tracking.",
      label: "Tasks",
      author: "Om Saraykar",
      published: "20 Jun 2025",
      url: "/blog/task-mastery",
      image: "/stratify-logo.png",
    },
    {
      id: "post-3",
      title: "Journaling for Stress Relief and Focus",
      summary:
        "Discover guided journaling powered by AI to reflect, declutter your mind, and manage stress proactively.",
      label: "Wellness",
      author: "Om Saraykar",
      published: "17 Jun 2025",
      url: "/blog/journaling",
      image: "/stratify-logo.png",
    },
  ],
}: StratifyBlogProps) => {
  return (
    <section>
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            {tagline}
          </Badge>
          <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            {heading}
          </h2>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            {description}
          </p>
          <Button variant="link" className="w-full sm:w-auto" asChild>
            <a href={buttonUrl}>
              {buttonText}
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="grid grid-rows-[auto_auto_1fr_auto] pt-0">
              <div className="aspect-16/9 w-full">
                <a
                  href={post.url}
                  className="transition-opacity duration-200 fade-in hover:opacity-70"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover object-center"
                  />
                </a>
              </div>
              <CardHeader>
                <h3 className="text-lg font-semibold hover:underline md:text-xl">
                  <a href={post.url}>{post.title}</a>
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.summary}</p>
              </CardContent>
              <CardFooter>
                <a
                  href={post.url}
                  className="flex items-center text-foreground hover:underline"
                >
                  Read more
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Blog7 };
