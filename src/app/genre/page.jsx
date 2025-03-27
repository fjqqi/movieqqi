"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Emoji mapping for genres
const genreEmojis = {
  Action: "🔥",
  Adventure: "🌍",
  Animation: "🎨",
  Comedy: "😂",
  Crime: "🕵️‍♂️",
  Documentary: "🎥",
  Drama: "🎭",
  Family: "👨‍👩‍👧",
  Fantasy: "🧙‍♂️",
  History: "📜",
  Horror: "👻",
  Music: "🎵",
  Mystery: "🕶️",
  Romance: "❤️",
  "Science Fiction": "🚀",
  "TV Movie": "📺",
  Thriller: "🔪",
  War: "⚔️",
  Western: "🤠",
};

const GenrePage = () => {
  const {
    data: genreData,
    isPending: genreLoading,
    error: genreError,
  } = useQuery({
    queryKey: ["genres"],
    queryFn: () =>
      fetch(
        `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${API_KEY}`
      ).then((res) => res.json()),
  });

  if (genreLoading) return <p>Loading genres...</p>;
  if (genreError) return <p className="text-red-500">Failed to load genres</p>;

  const genres = genreData?.genres || [];

  return (
    <div className="container mx-auto p-6 text-base-content">
      <h1 className="text-3xl font-bold text-center mb-6">Movies By Genre</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {genres.map((genre) => (
          <Link
            href={`genre/${genre.id}`}
            key={genre.id}
            className="bg-base-100 rounded-xl shadow-md p-4 flex flex-col items-center justify-center transform hover:scale-105 transition duration-300"
          >
            <span className="text-4xl">{genreEmojis[genre.name] || "🎬"}</span>
            <h2 className="text-lg font-semibold mt-2">{genre.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenrePage;