import { useRouter } from 'next/router';
import classes from './Error.module.scss';
const Error = () => {
    const router = useRouter();
    const handleClick = () => {
        router.push('/');
    };
    return <>
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

        <h1 className={classes.h1}>Oops! Something went wrong!</h1>
        <div className={classes.btn} onClick={handleClick}>Return to Home</div>
    </>
}

export default Error