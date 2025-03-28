"use client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import MovieCard from "./components/MovieCard";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function Home() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query"); // Get search query from URL
  const isSearching = Boolean(query); // Check if user is searching

  const { isPending, error, data } = useQuery({
    queryKey: isSearching ? ["search", query] : ["movie"],
    queryFn: () =>
      fetch(
        isSearching
          ? `https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US&page=1&api_key=${API_KEY}`
          : `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${API_KEY}`
      ).then((res) => res.json()),
  });

  if (isPending) return "Loading...";
  if (error) return `An error has occurred: ${error.message}`;

  const movies = data?.results || [];

  return (
    <>
      <h1 className="text-center text-2xl font-bold mb-4">
        {isSearching ? `Search Results for "${query}"` : "Now Playing"}
      </h1>

      <div className="flex flex-wrap w-full justify-center gap-x-4 gap-y-5">
        {movies.length > 0 ? (
          movies.map((movie) => <MovieCard movie={movie} key={movie.id} />)
        ) : (
          <p className="text-center">No results found.</p>
        )}
      </div>
    </>
  );
}