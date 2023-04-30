import InsideClass from "@/components/home/InsideClass";
import { useRouter } from "next/router";
const Dynamic = () => {
    const { query } = useRouter();

    return (
        <div>
            <InsideClass classId={query.classId} />
        </div>
    )
}

export default Dynamic;