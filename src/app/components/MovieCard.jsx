import Link from "next/link";
import React from "react";

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  }

const MovieCard = ({movie}) => {
  return (
    <Link href={`/movies/${movie.id}`} key={movie.id}>
      <div className="card bg-base-100 w-52 shadow-sm h-full">
        <figure>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{movie.title}</h2>
          <p>{truncateText(movie.overview, 100)}</p>
          <div className="card-actions justify-end">
            <div className="badge badge-outline">
            ⭐ {movie.vote_average.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  ); // ✅ Now it returns JSX
};

export default MovieCard;
