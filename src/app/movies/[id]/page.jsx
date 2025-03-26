"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function MovieDetail() {
  const params = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["movie", params.id],
    queryFn: () =>
      fetch(
        `https://api.themoviedb.org/3/movie/${params.id}?language=en-US&api_key=${API_KEY}`
      ).then((res) => res.json()),
  });

  if (isPending)
    return <div className="flex justify-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center">Error: {error.message}</div>
    );

  return (
    <div className="container mx-auto p-6">
      {/* Backdrop Image */}
      <div
        className="relative w-full h-80 bg-cover bg-center rounded-xl"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${data.backdrop_path})`,
        }}
      >
        {/* <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div> */}
      </div>

      {/* Movie Info Section */}
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Movie Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
          alt={data.title}
          className="w-64 rounded-lg shadow-lg"
        />

        {/* Movie Details */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold">
            {data.title} ({data.release_date?.split("-")[0]})
          </h1>

          {/* Genres */}
          <div className="mt-2 flex flex-wrap gap-2">
            {data.genres.map((genre) => (
              <span key={genre.id} className="badge badge-secondary">
                {genre.name}
              </span>
            ))}
          </div>

          {/* Ratings & Runtime */}
          <div className="mt-3 flex items-center space-x-4">
            <span className="text-lg font-semibold">
              ⭐ {data.vote_average.toFixed(1)} / 10
            </span>
            <span className="text-gray-400">{data.runtime} min</span>
          </div>

          {/* Rotten Tomatoes-style Scores */}
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-500">
                🍅 {Math.round(data.vote_average * 10)}%
              </span>
              <span className="text-gray-500 text-sm">Critic Score</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-500">
                🎟️ {Math.round((data.popularity / 1000) * 100)}%
              </span>
              <span className="text-gray-500 text-sm">Audience Score</span>
            </div>
          </div>

          {/* Overview */}
          <p className="mt-4 text-gray-300">{data.overview}</p>
        </div>
      </div>

      {/* Cast Section */}
      <MovieCast movieId={data.id} />
    </div>
  );
}

/* Fetch Cast Data */
function MovieCast({ movieId }) {
  const { isPending, error, data } = useQuery({
    queryKey: ["cast", movieId],
    queryFn: () =>
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US&api_key=${API_KEY}`
      ).then((res) => res.json()),
  });

  if (isPending) return <p className="mt-6">Loading cast...</p>;
  if (error) return <p className="mt-6 text-red-500">Failed to load cast.</p>;
  const cast = data.cast.slice(0, 10);

  console.log(data);
  return (
    <>
      <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-3 text-center md:text-left">Top Cast</h2>

        <div className="flex flex-wrap gap-4 overflow-x-auto py-2 px-1 scrollbar-hide">
          {cast.map((actor) => {
            return (
                <div key={actor.id}  className="flex flex-col items-center w-32">
                <img
                  src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  alt={actor.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-md"
                />
                <p className="text-sm text-center mt-2">{actor.name}</p>
                <p className="text-xs text-gray-400">{actor.character}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
