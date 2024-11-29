"use client";

import { ArrowUpDown, Clock, Star } from "lucide-react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import {
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
} from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Library = {
  id: string;
  name: string;
  displayName: MDXRemoteSerializeResult;
  url: string;
  description: string;
  displayDescription: MDXRemoteSerializeResult;
  category: string;
  subCategory: string;
  platforms: string[];
  stars?: number;
};

const components = {
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <Button variant="link" className="h-auto p-0" asChild>
      <a {...props} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    </Button>
  ),
  code: (props: HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-muted px-[0.3rem] py-[0.1rem]">
      {props.children}
    </code>
  ),
} as const;

export function LibraryList({
  libraries,
  platforms,
  categories,
}: {
  libraries: Library[];
  platforms: string[];
  categories: string[];
}) {
  const [filteredLibraries, setFilteredLibraries] = useState<Library[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] =
    useState<string[]>(platforms);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(categories);
  const [sortBy, setSortBy] = useState<
    "stars" | "name" | "category" | "subCategory"
  >("stars");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let result = [...libraries];

    if (selectedPlatforms.length !== platforms.length) {
      result = result.filter((lib) =>
        lib.platforms.some((platform) => selectedPlatforms.includes(platform)),
      );
    }

    if (selectedCategories.length !== categories.length) {
      result = result.filter((lib) =>
        selectedCategories.includes(lib.category),
      );
    }

    if (searchTerm) {
      result = result.filter(
        (lib) =>
          lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lib.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    result.sort((a, b) => {
      if (sortBy === "stars") {
        return sortOrder === "asc"
          ? (a.stars ?? 0) - (b.stars ?? 0)
          : (b.stars ?? 0) - (a.stars ?? 0);
      } else if (sortBy === "category") {
        return sortOrder === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      } else if (sortBy === "subCategory") {
        return sortOrder === "asc"
          ? a.subCategory.localeCompare(b.subCategory)
          : b.subCategory.localeCompare(a.subCategory);
      } else {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });

    setFilteredLibraries(result);
  }, [
    libraries,
    platforms,
    categories,
    selectedPlatforms,
    selectedCategories,
    sortBy,
    sortOrder,
    searchTerm,
  ]);

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const toggleSort = (
    newSortBy: "stars" | "name" | "category" | "subCategory",
  ) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 p-2 text-center text-2xl font-bold">
        Kotlin Multiplatform Libraries
      </h1>

      <div className="mb-8 grid gap-6">
        <div className="rounded-lg border p-6">
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-lg font-semibold">Search</h2>
              <Input
                type="text"
                placeholder="Search libraries by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-4 flex items-center md:mb-2">
                <h2 className="flex-1 text-lg font-semibold">Platforms</h2>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all-platforms"
                    checked={selectedPlatforms.length === platforms.length}
                    onCheckedChange={(checked) => {
                      setSelectedPlatforms(checked ? platforms : []);
                    }}
                  />
                  <Label htmlFor="select-all-platforms">Select All</Label>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {platforms.map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={`platform-${platform}`}
                      checked={selectedPlatforms.includes(platform)}
                      onCheckedChange={() => handlePlatformChange(platform)}
                    />
                    <Label htmlFor={`platform-${platform}`}>{platform}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center">
                <h2 className="flex-1 text-lg font-semibold">Categories</h2>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all-categories"
                    checked={selectedCategories.length === categories.length}
                    onCheckedChange={(checked) => {
                      setSelectedCategories(checked ? categories : []);
                    }}
                  />
                  <Label htmlFor="select-all-categories">Select All</Label>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                      id={`category-${category}`}
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-right text-sm text-muted-foreground">
              {filteredLibraries.length}{" "}
              {filteredLibraries.length === 1 ? "library" : "libraries"} found
            </div>

            <div className="flex flex-col justify-between gap-2 text-sm text-muted-foreground md:flex-row">
              <div className="flex items-center gap-2">
                <Clock className="size-8 md:size-4" />
                This list (including the number of stars) is automatically
                updated around 12:00 UTC.
              </div>
              <Button
                variant="link"
                asChild
                className="text-sm text-muted-foreground"
              >
                <a href="https://github.com/AAkira/Kotlin-Multiplatform-Libraries">
                  <svg
                    role="img"
                    className="fill-current stroke-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>GitHub</title>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">
                    <Button variant="ghost" onClick={() => toggleSort("name")}>
                      Name
                      <ArrowUpDown className="size-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort("category")}
                    >
                      Category
                      <ArrowUpDown className="size-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort("subCategory")}
                    >
                      Subcategory
                      <ArrowUpDown className="size-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">Platforms</TableHead>
                  <TableHead className="text-right font-semibold">
                    <Button
                      variant="ghost"
                      className="px-1"
                      onClick={() => toggleSort("stars")}
                    >
                      GitHub Stars
                      <ArrowUpDown className="size-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLibraries.map((library) => (
                  <TableRow key={library.id}>
                    <TableCell className="font-medium">
                      <Button variant="link" asChild>
                        <a
                          href={library.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MDXRemote {...library.displayName} />
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell className="max-w-xl">
                      <MDXRemote
                        {...library.displayDescription}
                        components={components}
                      />
                    </TableCell>
                    <TableCell>{library.category}</TableCell>
                    <TableCell>{library.subCategory}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {library.platforms.map((platform) => (
                          <Badge key={platform} variant="outline">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {library.stars !== undefined ? (
                        <span className="inline-flex items-center">
                          <Star className="mr-1 size-4" />
                          {new Intl.NumberFormat().format(library.stars)}
                        </span>
                      ) : (
                        <span
                          className="text-muted-foreground"
                          title="This library is not on GitHub"
                        >
                          N/A
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
