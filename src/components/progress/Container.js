export const Container = ({ animationDuration, children, isFinished }) => {
  return (
    <div
      style={{
        pointerEvents: "none",
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
      {children}
    </div>
  );
};
