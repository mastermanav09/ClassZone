import { Modal } from "react-responsive-modal";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import classes from "./AddClassForm.module.scss";
const AddClassForm = (props) => {
	const { addClassModal, showAddClassModal } = props;
	const form = useForm();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = form;
	const onSubmit = (data) => {
		addClassModal();
		router.replace({
			pathname: "/class/[classId]",
			query: { classId: 2 },
		});
	};
	return (
		<div>
			<Modal
				classNames={classes["react-responsive-modal-modal"]}
				onClose={addClassModal}
				center
				open={showAddClassModal}
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
					<h2>Create class</h2>
					<form
						className={classes.form}
						id="my-form"
						type="text"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div>
							<label htmlFor="nameOfClass">Class name</label>
							<input
								type="text"
								id="nameOfClass"
								placeholder="Class name (required)"
								{...register("nameOfClass", {
									required: "Please enter valid name of class",
									minLength: {
										value: 5,
										message: "Name of Class must be of at least 5 characters.",
									},
								})}
							/>

							{errors.nameOfClass && (
								<div className={classes["validation-text"]}>
									{errors.nameOfClass.message}
								</div>
							)}
						</div>
						<div>
							<label htmlFor="maneOfSection">Section</label>
							<input
								type="text"
								placeholder="Section"
								id="nameOfSection"
								{...register("nameOfSection", {
									required: "Please enter valid name of section",
									minLength: {
										value: 3,
										message:
											"Name of section must be of at least 3 characters.",
									},
								})}
							/>
							{errors.nameOfSection && (
								<div className={classes["validation-text"]}>
									{errors.nameOfSection.message}
								</div>
							)}
						</div>
						<div>
							<label htmlFor="nameOfSubject">Subject</label>
							<input
								type="text"
								placeholder="Subject"
								id="nameOfSubject"
								{...register("nameOfSubject", {
									required: "Please enter valid name of subject",
									minLength: {
										value: 3,
										message:
											"Name of subject must be of at least 3 characters.",
									},
								})}
							/>
							{errors.nameOfSubject && (
								<div className={classes["validation-text"]}>
									{errors.nameOfSubject.message}
								</div>
							)}
						</div>
					</form>
					<div className={classes.btn}>
						<button type="submit" form="my-form">
							Create
						</button>
						<button onClick={addClassModal}>Cancel</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default AddClassForm;
