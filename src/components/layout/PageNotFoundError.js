import { useRouter } from "next/router";
import classes from "./PageNotFoundError.module.scss";

const PageNotFoundError = () => {
  const router = useRouter();
  const handleClick = () => {
    router.replace("/");
  };
  return (
    <>
      <div className={classes.face}>
        <div className={classes.band}>
          <div className={classes.red}></div>
          <div className={classes.white}></div>
          <div className={classes.blue}></div>
        </div>
        <div className={classes.eyes}></div>
        <div className={classes.dimples}></div>
        <div className={classes.mouth}></div>
      </div>

      <h1 className={classes.h1}>
        We&apos;re sorry. The Web address you entered is not a functioning page
        on our site. 🙁
      </h1>
      <div className={classes.btn} onClick={handleClick}>
        Return to Home
      </div>
    </>
  );
};

export default PageNotFoundError;
