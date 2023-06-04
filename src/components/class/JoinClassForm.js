import { Modal } from "react-responsive-modal";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import classes from "./JoinClassForm.module.scss";
import LoadingSpinner from "../progress/LoadingSpinner";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { joinClass } from "../../../utils/store/reducers/class";
import "react-responsive-modal/styles.css";
const JoinClassForm = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const { toggleJoinClassModal, showJoinClassModal } = props;
	const form = useForm();
	const { register, handleSubmit } = form;
	const router = useRouter();
	const dispatch = useDispatch();

	const onSubmit = ({ classCode }) => {
		dispatch(
			joinClass({
				toggleJoinClassModal,
				setIsLoading,
				router,
				classId: classCode,
			})
		);
	};

	return (
		<div>
			<Modal
				classNames={classes["react-responsive-modal-modal"]}
				onClose={toggleJoinClassModal}
				center
				open={showJoinClassModal}
				animationDuration={200}
				styles={{
					overlay: {
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(0, 0, 0, 0.75)",
					},
					closeIcon: {
						fill: "#ff0000",
					},
					modal: {
						borderRadius: "10px",
					},
				}}
			>
				<div className={classes.modal}>
					<h2>Join class</h2>
					<form
						className={classes.form}
						id="joinClass-form"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div>
							<label htmlFor="classCode">Class code</label>
							<input
								type="text"
								required
								placeholder="Class code"
								id="classCode"
								{...register("classCode")}
							/>
						</div>
					</form>
					<div className={classes.btn}>
						<button type="submit" form="joinClass-form" disabled={isLoading}>
							{isLoading ? (
								<LoadingSpinner className={classes.spinner} />
							) : (
								"Join"
							)}
						</button>
						<button onClick={toggleJoinClassModal}>Cancel</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default JoinClassForm;
