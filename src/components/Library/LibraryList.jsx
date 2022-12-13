import classes from "./LibraryList.module.scss";
import SmallItemCard from "../../UI/SmallItemCard";

const LibraryList = ({ items, page }) => {
  return (
    <ul className={classes.libraryList}>
      {items?.map((item) => (
        <li key={item?.id}>
          <SmallItemCard data={item} page={page} />
        </li>
      ))}
    </ul>
  );
};

export default LibraryList;
