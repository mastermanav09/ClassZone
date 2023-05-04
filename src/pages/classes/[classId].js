import ClassUI from "@/components/home/ClassUI";
import { getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth]";

const Class = () => {
  const { query } = useRouter();

  return <ClassUI classId={query.classId} />;
};

Class.auth = true;
export default Class;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
