"use client";
import Image from "next/image";
import {
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import MovieCard from "./components/MovieCard";


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
        `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${currentPage}&api_key=${API_KEY}`
      ).then((res) => res.json()),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  
  

  const movies = data.results;
  console.log(data);

  return (
    <>
     

     <div className="flex flex-wrap  w-full  justify-center gap-x-4 gap-y-5">
     {movies.map((movie, i) => {
        return (
          <MovieCard movie={movie} key={movie.id}/>
        ); // ✅ Now it returns JSX
      })}
     </div>
    </>
  );
}
