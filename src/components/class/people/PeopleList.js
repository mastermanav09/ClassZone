import React, { useState, useRef, useEffect } from "react";
import NavDropdown from "../ClassNavDropdown";
import UserCard from "../UserCard";
import Search from "@/components/svg/Search";
import classes from "./PeopleList.module.scss";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  getClass,
  getClassPeople,
} from "../../../../utils/store/reducers/class";
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
      if (!classDetails.teacher) {
        dispatch(getClass({ router, classId }));
      }

      if (!people) {
        dispatch(getClassPeople({ router, classId }));
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
    return <LoadingSpinner className={classes.spinner} />;
  }

  return (
    <>
      <div className={classes.people}>
        <NavDropdown _id={classId} backgroundColor={backgroundColor} />
        <div className={classes.container}>
          <div>
            <p>Teacher</p>
            <hr className={classes.blueHR} />
            <UserCard user={teacher} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p>People</p>
              <div className={classes["search-box"]}>
                <input
                  ref={inputEl}
                  type="text"
                  className={classes.searchText}
                  placeholder="Search Student"
                  value={searchTerm}
                  onChange={getSearchTerm}
                />
                <div className={classes.searchBtn}>
                  <Search />
                </div>
              </div>
            </div>
            <hr className={classes.blueHR} />
            {searchTerm.length !== 0 && searchResults?.length === 0 && (
              <h3 className={classes["no_found_text"]}>No match found!!</h3>
            )}

            {searchTerm.length === 0 && searchResults?.length === 0 && (
              <h4 className={classes["no_found_text"]}>
                There are no students in the classroom.
              </h4>
            )}

            {searchResults?.map((user) => (
              <>
                <UserCard user={user} />
                <hr className={classes.HR} />
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PeopleList;
