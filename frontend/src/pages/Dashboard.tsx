import { Appbar } from "../component/Appbar";
import { Balance } from "../component/Balance";
import { User } from "../component/User";

export function Dashboard() {

    return <div>
        <Appbar/>
        <div className="m-10">
            <div className="m-10">
                <Balance/>
            </div>
            <div className="m-10">
                <User/>
            </div>
        </div>
    </div>
}