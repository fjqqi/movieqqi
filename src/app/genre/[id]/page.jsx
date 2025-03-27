"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/components/Loading";
import MovieCard from "@/app/components/MovieCard";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function Genre() {
  const params = useParams();
  const genreId = params.id; // ✅ Get genreId dynamically

  /* Fetch Genre List First */
  const { data: genreData, isPending: genreLoading, error: genreError } = useQuery({
    queryKey: ["genres"],
    queryFn: () =>
      fetch(`https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${API_KEY}`)
        .then((res) => res.json()),
  });

  /* Find Genre Name */
  const genreName = genreData?.genres?.find((g) => g.id == genreId)?.name || "Unknown Genre";

  /* Fetch Movies by Genre */
  const { data: movieData, isPending: movieLoading, error: movieError } = useQuery({
    queryKey: ["movies", genreId], // ✅ Unique key per genre
    queryFn: () =>
      fetch(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en&api_key=${API_KEY}`
      ).then((res) => res.json()),
    enabled: !!genreId, // ✅ Only fetch when genreId exists
  });

  /* Handle Loading & Errors */
  if (genreLoading || movieLoading) return <Loading />;
  if (genreError || movieError)
    return <div className="text-red-500 text-center">Error: {genreError?.message || movieError?.message}</div>;

  const movies = movieData?.results || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">{genreName} Movies</h1>

      <div className="flex flex-wrap w-full justify-center gap-x-4 gap-y-5">
        {movies.length > 0 ? (
          movies.map((movie) => <MovieCard movie={movie} key={movie.id} />)
        ) : (
          <p className="text-center text-gray-400">No movies found.</p>
        )}
      </div>
    </div>
  );
}