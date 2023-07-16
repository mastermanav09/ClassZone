import { useRouter } from "next/router";
import Link from "next/link";
import PropTypes from "prop-types";
export { NavLink };

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  exact: PropTypes.bool,
};

NavLink.defaultProps = {
  exact: false,
};

function NavLink({ href, exact, children, ...props }) {
  const { asPath } = useRouter();
  let updatedHref = href;
  if (typeof href !== "string") {
    updatedHref = href.pathname;
  }

  const isActive = exact
    ? asPath === updatedHref
    : asPath.startsWith(updatedHref);

  if (isActive) {
    props.className += " " + props.activeClass;
  } else {
    props.className += " " + props.inactiveClass;
  }

  return (
    <Link href={href} className={props.className}>
      {children}
    </Link>
  );
}
