function HomePage() {
  return <>HomePage</>;
}

export default HomePage;

HomePage.getInitialProps = async (context) => {
  return {
    title: "Class Zone",
    description:
      "It is a learning management system which is designed to manage and deliver online educational content, including online courses, training programs, and other educational content.",
  };
};
