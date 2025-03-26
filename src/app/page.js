"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Navbar } from "./components/Navbar";
import {
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";


const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);

  const toPageTwo = () => {
    setCurrentPage(2);
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["movie"],
    queryFn: () =>
      fetch(
        `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}&api_key=${API_KEY}`
      ).then((res) => res.json()),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  }
  
  

  const movies = data.results;
  console.log(data);

  return (
    <>
     

     <div className="flex flex-wrap  w-full  justify-center gap-x-4 gap-y-5">
     {movies.map((movie, i) => {
        return (
          <Link href={`movies/${movie.id}`} key={movie.id}>
            <div className="card bg-base-100 w-52 shadow-sm h-full">
              <figure>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  {movie.title}
                </h2>
                <p>
                  {truncateText(movie.overview, 100)}
                </p>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline">{truncateText(movie.vote_average,1)}</div>
                </div>
              </div>
            </div>
          </Link>
        ); // ✅ Now it returns JSX
      })}
     </div>
    </>
  );
}
