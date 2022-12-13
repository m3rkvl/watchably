import classes from "./ExploreList.module.scss";
import ExploreMovieCard from "./ExploreMovieCard";
import ExploreSeriesCard from "./ExploreSeriesCard";

const ExploreList = ({ items, movie }) => {
  return (
    <ul className={classes.moviesList}>
      {items?.map((item, i) => (
        <li key={item?.id}>
          {movie && <ExploreMovieCard data={item} index={i} topRated={true} />}
          {!movie && (
            <ExploreSeriesCard data={item} index={i} topRated={true} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default ExploreList;
