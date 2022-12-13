import { useEffect, useState } from "react";
import classes from "./SearchList.module.scss";
import SmallItemCard from "../../UI/SmallItemCard";

const SearchList = ({ searchResults }) => {
  const [results, setResults] = useState([]);
  useEffect(() => {
    setResults(searchResults);
  }, [searchResults]);

  return (
    <ul className={classes.searchList}>
      {results?.map((result) => (
        <li key={result?.id}>
          <SmallItemCard data={result} />
        </li>
      ))}
    </ul>
  );
};

export default SearchList;
