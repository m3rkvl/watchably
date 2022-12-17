const APIKey = "caf2c01855c455cdaa421e41ce07fa14";

export async function getSearchResults(query, page) {
  const queryStr = `query=${query}`;
  const pageStr = `page=${page}`;
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&api_key=${APIKey}&${queryStr}&${pageStr}`
  );

  if (!response.ok) {
    throw Error({ message: "Failed to fetch search results.", status: 500 });
  }

  return response.json();
}

export async function getMovieDetails(id) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${APIKey}&language=en-US`
  );

  if (!response.ok) {
    throw new Error({
      message: "Failed to fetch search results.",
      status: 500,
    });
  }

  const responseCredits = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${APIKey}&language=en-US`
  );

  if (!responseCredits.ok)
    throw new Error({
      message: "Failed to fetch search results.",
      status: 500,
    });

  const mainData = await response.json();
  const creditsData = await responseCredits.json();
  const creditsDataCast = creditsData.cast.slice(0, 5);
  //prettier-ignore
  const creditsDataCrewProd1 = creditsData.crew.filter( (prod) => prod.job === "Executive Producer" && prod.profile_path);
  //prettier-ignore
  const creditsDataCrewProd2 = creditsData.crew.filter((prod) => prod.job === "Executive Producer" && !prod.profile_path);
  const creditsDataCrewProd = creditsDataCrewProd1.concat(creditsDataCrewProd2);
  //prettier-ignore
  const creditsDataCrewDir = creditsData.crew.filter((member) => member.job === "Director");
  //prettier-ignore
  const creditsDataCrewPri = creditsData.crew.filter((member) => member.job === "Novel" || member.job === "Screenplay");
  //prettier-ignore
  const creditsDataCrewBefore = creditsDataCrewDir.concat(creditsDataCrewPri, creditsDataCrewProd);
  //prettier-ignore
  const creditsDataCrew = creditsDataCrewBefore.length > 5 ? creditsDataCrewBefore.slice(0, 5) : creditsDataCrewBefore.slice(0);

  mainData.cast = creditsDataCast;
  mainData.crew = creditsDataCrew;
  // console.log(mainData);

  return mainData;
}

export async function getSeriesDetails(id) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${APIKey}&language=en-US`
  );

  if (!response.ok) {
    throw Error({ message: "Failed to fetch search results.", status: 500 });
  }

  const responseCredits = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${APIKey}&language=en-US`
  );

  if (!responseCredits.ok)
    throw new Error({
      message: "Failed to fetch search results.",
      status: 500,
    });

  const mainData = await response.json();
  const creditsData = await responseCredits.json();
  const creditsDataCast = creditsData.cast.slice(0, 5);
  //prettier-ignore
  const creditsDataCrewProd1 = creditsData.crew.filter( (prod) => prod.job === "Executive Producer" && prod.profile_path);
  //prettier-ignore
  const creditsDataCrewProd2 = creditsData.crew.filter((prod) => prod.job === "Executive Producer" && !prod.profile_path);
  const creditsDataCrewProd = creditsDataCrewProd1.concat(creditsDataCrewProd2);
  //prettier-ignore
  const creditsDataCrewDir = creditsData.crew.filter((member) => member.job === "Director");
  //prettier-ignore
  const creditsDataCrewPri = creditsData.crew.filter((member) => member.job === "Novel" || member.job === "Screenplay");
  //prettier-ignore
  const creditsDataCrewBefore = creditsDataCrewDir.concat(creditsDataCrewPri, creditsDataCrewProd);
  //prettier-ignore
  const creditsDataCrew = creditsDataCrewBefore.length > 5 ? creditsDataCrewBefore.slice(0, 5) : creditsDataCrewBefore.slice(0);

  mainData.cast = creditsDataCast;
  mainData.crew = creditsDataCrew;

  return mainData;
}
