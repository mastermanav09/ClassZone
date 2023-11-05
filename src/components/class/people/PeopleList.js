import React, { useState, useRef, useEffect } from "react";
import ClassNavDropdown from "../ClassNavDropdown";
import PeopleUserCard from "../PeopleUserCard";
import classes from "./PeopleList.module.scss";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  removeClassMember,
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
  const teacher = useSelector(
    (state) => state.class.currentClassDetails?.teacher
  );
  const [searchResults, setSearchResults] = useState(people || []);
  const inputEl = useRef("");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [removeMemberId, setRemoveMemberId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (classId) {
      if (!people) {
        dispatch(getClassPeople({ classId, router }));
      }
    }
  }, [people, classId, dispatch, router]);

  useEffect(() => {
    const newList = people?.filter((user) => {
      return user.credentials.name.toLowerCase().includes(searchTerm);
    });

    setSearchResults(newList);
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

  const confirmRemoveHandler = (value, classMemberId) => {
    setConfirmRemove(value);
    setRemoveMemberId(classMemberId);
  };

  const removeMemberHandler = () => {
    dispatch(
      removeClassMember({
        classId,
        removeMemberId,
        setIsLoading,
        confirmRemoveHandler,
      })
    );
  };

  const fields = [
    {
      text: "Remove",
      param: "_id",
      action: (classMemberId) => confirmRemoveHandler(true, classMemberId),
    },
  ];

  return (
    <>
      <ClassNavDropdown classId={classId} backgroundColor={backgroundColor} />
      <div className={classes.people}>
        <div className={classes.container}>
          <div>
            <p>Teacher</p>
            <hr className={classes.blueHR} />
            <PeopleUserCard
              teacher={teacher}
              confirmRemove={confirmRemove}
              confirmRemoveHandler={confirmRemoveHandler}
              removeMemberHandler={removeMemberHandler}
              classMember={teacher}
              fields={[]}
              isLoading={isLoading}
            />
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
                There are no members in the classroom.
              </h3>
            )}

            {searchResults?.map((classMember) => (
              <PeopleUserCard
                teacher={teacher}
                classMember={classMember}
                confirmRemoveHandler={confirmRemoveHandler}
                confirmRemove={confirmRemove}
                removeMemberHandler={removeMemberHandler}
                key={classMember._id}
                fields={fields}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(PeopleList);
