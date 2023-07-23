import React, { useState, useRef, useEffect } from "react";
import ClassNavDropdown from "../ClassNavDropdown";
import UserCard from "../UserCard";
import Search from "@/components/svg/Search";
import classes from "./PeopleList.module.scss";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getClassPeople } from "../../../../utils/store/reducers/class";
import LoadingSpinner from "@/components/progress/LoadingSpinner";

const PeopleList = () => {
  const router = useRouter();
  const { classId, bc: backgroundColor } = router.query;
  const [searchTerm, setSearchTerm] = useState("");
  const people = useSelector(
    (state) => state.class?.currentClassDetails?.people
  );
  const classDetails = useSelector((state) => state.class?.currentClassDetails);
  const { teacher } = classDetails;
  const [searchResults, setSearchResults] = useState(people || []);
  const inputEl = useRef("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (classId) {
      if (!people) {
        dispatch(getClassPeople({ classId, router }));
      }
    }
  }, [classDetails, classId, dispatch, people, router]);

  useEffect(() => {
    if (searchTerm !== null && people) {
      const newList = people.filter((user) => {
        return user.credentials.name.toLowerCase().includes(searchTerm);
      });

      setSearchResults(newList);
    } else {
      setSearchResults(people);
    }
  }, [searchTerm, people]);

  const getSearchTerm = () => {
    setSearchTerm(inputEl?.current?.value.toLowerCase());
  };

  if (!people) {
    return (
      <div className={classes["center"]}>
        <LoadingSpinner className={classes.spinner} />
      </div>
    );
  }

  return (
    <>
      <div className={classes.people}>
        <ClassNavDropdown _id={classId} backgroundColor={backgroundColor} />
        <div className={classes.container}>
          <div>
            <p>Teacher</p>
            <hr className={classes.blueHR} />
            <UserCard user={teacher} />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p>People {`(${searchResults?.length})`}</p>
              <div className={classes["search-box"]}>
                <input
                  ref={inputEl}
                  type="text"
                  className={classes.searchText}
                  placeholder="Search student"
                  value={searchTerm}
                  onChange={getSearchTerm}
                />
              </div>
            </div>
            <hr className={classes.blueHR} />
            {searchTerm.length !== 0 && searchResults?.length === 0 && (
              <h3 className={classes["no_found_text"]}>No match found!</h3>
            )}

            {searchTerm.length === 0 && searchResults?.length === 0 && (
              <h3 className={classes["no_found_text"]}>
                There are no students in the classroom.
              </h3>
            )}

            {searchResults?.map((user) => (
              <UserCard user={user} key={user._id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(PeopleList);
