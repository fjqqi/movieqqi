"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/components/Loading";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function MovieDetail() {
  const params = useParams();
  const movieId = params?.id;

  /* Fetch Movie Details */
  const {
    isPending: moviePending,
    error: movieError,
    data: movieData,
  } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () =>
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&api_key=${API_KEY}`
      ).then((res) => res.json()),
  });

  /* Fetch Movie Credits */
  const {
    isPending: crewPending,
    error: crewError,
    data: crewData,
  } = useQuery({
    queryKey: ["crew", movieId],
    queryFn: () =>
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US&api_key=${API_KEY}`
      ).then((res) => res.json()),
    enabled: !!movieId,
  });
  const crew = crewData?.crew || [];
  // const genreName = genreData?.genres?.find((g) => g.id == genreId)?.name || "Unknown Genre";
  const director = crew?.find((d)=> d.job === "Director") 
  console.log(director);


  if (moviePending || crewPending)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );

  if (movieError || crewError)
    return (
      <div className="text-red-500 text-center">
        Error: {movieError?.message || crewError?.message}
      </div>
    );

  return (
    <div className="container mx-auto  lg:px-4">
      {/* Backdrop Image */}
      <div
        className="relative w-full h-64 lg:h-80 bg-cover bg-center lg:rounded-xl"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movieData.backdrop_path})`,
        }}
      >
        {/* <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div> */}
      </div>

      {/* Movie Info Section */}
      <div className="flex flex-col md:flex-row gap-6 lg:mt-6 mt-2 lg:px-0 px-2">
        {/* Movie Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
          alt={movieData.title}
          className="w-64 rounded-lg shadow-lg"
        />

        {/* Movie Details */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold">
            {movieData.title} ({movieData.release_date?.split("-")[0]})
          </h1>

          <h2 className="text-xl text-base-content opacity-50  mb-2">
            {director.name} 
          </h2>

          {/* Genres */}
          <div className="mt-2 flex flex-wrap gap-2">
            {movieData.genres.map((genre) => (
              <Link
                key={genre.id}
                href={`/genre/${genre.id}`}
                className="badge badge-secondary"
              >
                {genre.name}
              </Link>
            ))}
          </div>

          {/* Ratings & Runtime */}
          <div className="mt-3 flex items-center space-x-4">
            <span className="text-lg font-semibold">
              ⭐ {movieData.vote_average.toFixed(1)} / 10
            </span>
            <span className="text-base-content">{movieData.runtime} min</span>
          </div>

          {/* Rotten Tomatoes-style Scores */}
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-500">
                🍅 {Math.round(movieData.vote_average * 10)}%
              </span>
              <span className="text-gray-500 text-sm">Critic Score</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-500">
                🎟️ {Math.round((movieData.popularity / 1000) * 100)}%
              </span>
              <span className="text-gray-500 text-sm">Audience Score</span>
            </div>
          </div>

          {/* Overview */}
          <p className="mt-4 text-base-content">{movieData.overview}</p>
        </div>
      </div>

      {/* Cast Section */}
      <MovieCast movieId={movieData.id} />
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


  return (
    <>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-3 text-center md:text-left">
          Top Cast
        </h2>

        <div className="flex flex-wrap lg:flex-nowrap gap-4 overflow-x-auto py-2 px-1 scrollbar-hide">
          {cast.map((actor) => {
            return (
              <div key={actor.id} className="flex flex-col items-center w-32">
                <img
                  src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  alt={actor.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-md"
                />
                <p className="text-sm text-center mt-2">{actor.name}</p>
                <p className="text-xs text-gray-400 text-center">
                  {actor.character}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
