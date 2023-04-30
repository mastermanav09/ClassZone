import classes from "./Bar.module.scss";

export const Bar = ({ animationDuration, progress }) => {
  return (
    <div
      className={classes.bar}
      style={{
        marginLeft: `${(-1 + progress) * 100}%`,
        transition: `marginLeft ${animationDuration}ms linear`,
      }}
    ></div>
  );
};
