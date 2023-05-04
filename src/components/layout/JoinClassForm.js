import { Modal } from "react-responsive-modal";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import classes from "./JoinClassForm.module.scss";
const JoinClassForm = (props) => {
	const { joinClassModal, showJoinClassModal } = props;
	const form = useForm();
	const { register, handleSubmit } = form;
	const router = useRouter();
	const onSubmit = (data) => {
		joinClassModal();
		router.replace({
			pathname: "/class/[classId]",
			query: { classId: data.classCode },
		});
	};
	return (
		<div>
			<Modal
				classNames={classes["react-responsive-modal-modal"]}
				onClose={joinClassModal}
				center
				open={showJoinClassModal}
				animationDuration={1000}
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
						id="my-form"
						onSubmit={handleSubmit(onSubmit)}
					>
						<label htmlFor="classCode">Class code</label>
						<input
							type="text"
							required
							placeholder="Class code (required)"
							id="classCode"
							{...register("classCode")}
						/>
					</form>
					<div className={classes.btn}>
						<button type="submit" form="my-form">
							Join
						</button>
						<button onClick={joinClassModal}>Cancel</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default JoinClassForm;
