import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

import { LibraryList } from "@/components/library-list";

type Library = {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  subCategory: string;
  platforms: string[];
  stars?: number;
};

const parseReadme = (content: string): Omit<Library, "stars">[] => {
  const lines = content.split("\n");
  const libraries: Omit<Library, "stars">[] = [];

  let isParsingLibraries = false;
  let currentCategory = "";
  let currentSubCategory = "";
  let currentLibrary: Omit<Library, "stars"> | null = null;

  for (const [index, line] of lines.entries()) {
    if (line.startsWith("## Libraries")) {
      isParsingLibraries = true;
      continue;
    }

    if (isParsingLibraries && line.startsWith("## ")) {
      isParsingLibraries = false;
      continue;
    }

    if (!isParsingLibraries) {
      continue;
    }

    if (line === "" && currentLibrary) {
      libraries.push(currentLibrary);
      currentLibrary = null;
      continue;
    }

    if (line.startsWith("### ")) {
      currentCategory = line.slice(4).trim();
      currentSubCategory = "";
    } else if (line.startsWith("#### ")) {
      currentSubCategory = line.slice(5).trim();
    } else if (line.startsWith("* [")) {
      const [name, url, description] =
        line.match(/^\*\ \[([^\]]+)\]\(([^)]+)\)\ -\ (.+)$/)?.slice(1) ?? [];

      if (name && url && description) {
        currentLibrary = {
          id: `${index}`,
          name,
          url,
          description,
          category: currentCategory,
          subCategory: currentSubCategory,
          platforms: [],
        };
      }
    } else if (line.startsWith("![badge][badge-")) {
      const [platform] =
        line.match(/^!\[badge\]\[badge-(.+)\]$/)?.slice(1) ?? [];
      if (platform && currentLibrary) {
        currentLibrary.platforms.push(platform);
      }
    }
  }

  return libraries;
};

const getStars = async (url: string) => {
  const parsedUrl = new URL(url);
  if (parsedUrl.hostname !== "github.com") {
    return;
  }
  try {
    const response = await fetch(
      `https://api.github.com/repos${parsedUrl.pathname}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      },
    );
    const data = await response.json();
    return data.stargazers_count;
  } catch (error) {
    console.error(`Failed to fetch stars for ${url}:`, error);
  }
};

export default async function Home() {
  const response = await fetch(
    "https://api.github.com/repos/AAkira/Kotlin-Multiplatform-Libraries/contents/README.md",
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    },
  );
  const data = await response.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");

  const parsedLibraries = parseReadme(content);
  const platforms = Array.from(
    new Set(parsedLibraries.flatMap((lib) => lib.platforms)),
  ).sort();
  const categories = Array.from(
    new Set(parsedLibraries.map((lib) => lib.category)),
  ).sort();

  const mdxOptions = { remarkPlugins: [remarkGfm] };
  const libraries = await Promise.all(
    parsedLibraries.map(async (lib) => ({
      ...lib,
      stars: await getStars(lib.url),
      displayName: await serialize(lib.name, { mdxOptions }),
      displayDescription: await serialize(lib.description, { mdxOptions }),
    })),
  );

  return (
    <LibraryList
      libraries={libraries}
      platforms={platforms}
      categories={categories}
    />
  );
}
