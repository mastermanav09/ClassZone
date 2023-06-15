import React, { useState } from "react";
import { useRouter } from "next/router";
import classes from "./NavDropdown.module.scss";
import Subject from "../svg/Subject";
import Assignment from "../svg/Assignment";
import Classmates from "../svg/Classmates";
const NavDropdown = ({ _id }) => {
	const [showNavbarDropdown, setShowNavbarDropdown] = useState(false);
	const router = useRouter();
	return (
		<div>
			<div
				className={classes.options}
				onClick={() => setShowNavbarDropdown(!showNavbarDropdown)}
			>
				Options
			</div>
			{showNavbarDropdown ? (
				<div className={classes.dropdown} open>
					<ul>
						<li
							onClick={() =>
								router.push({
									pathname: "/classes/[classId]",
									query: { classId: _id },
								})
							}
						>
							<div style={{ display: "flex", justifyContent: "center" }}>
								<Subject />
								<p style={{ marginLeft: "10px" }}>Stream</p>
							</div>
						</li>
						<li>
							<div style={{ display: "flex", justifyContent: "center" }}>
								<Assignment />
								<p style={{ marginLeft: "10px" }}>Classwork</p>
							</div>
						</li>
						<li
							onClick={() =>
								router.push({
									pathname: "/People",
									query: {
										_id: _id,
									},
								})
							}
						>
							<div style={{ display: "flex", justifyContent: "center" }}>
								<Classmates />
								<p style={{ marginLeft: "10px" }}>People</p>
							</div>
						</li>
					</ul>
				</div>
			) : null}
		</div>
	);
};

export default NavDropdown;
