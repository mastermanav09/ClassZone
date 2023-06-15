import React, { useState, useRef, useEffect } from "react";
import classes from "./People.module.scss";
import UserCard from "@/components/class/UserCard";
import Search from "@/components/svg/Search";
import NavDropdown from "@/components/class/NavDropdown";
import { useRouter } from "next/router";
const People = () => {
	const peoples = [
		{ name: "Ashish" },
		{ name: "Manav" },
		{ name: "Sourabh" },
		{ name: "Rahul" },
		{ name: "Vineet" },
	];
	const router = useRouter();
	const { _id } = router.query;
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState(peoples);
	const inputEl = useRef("");
	useEffect(() => {
		if (searchTerm !== null) {
			const newList = peoples.filter((people) => {
				return Object.values(people)
					.join(" ")
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
			});
			setSearchResults(newList);
		} else {
			setSearchResults(peoples);
		}
	}, [searchTerm]);
	const getSearchTerm = () => {
		setSearchTerm(inputEl.current.value);
	};
	return (
		<>
			<div className={classes.People}>
				<NavDropdown _id={_id} />
				<div className={classes.bgImage}>
					<div className={classes.container}>
						<p>Teacher</p>
						<hr className={classes.blueHR} />
						<UserCard people={{ name: "Ramakishore" }} />
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<p>Students</p>
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
						{searchResults.length === 0 ? <h3>No match found!!</h3> : null}
						{searchResults.map((people) => (
							<>
								<UserCard people={people} />
								<hr className={classes.HR} />
							</>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default People;
