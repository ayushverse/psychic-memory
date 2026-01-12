import Button from "./components/Button.tsx";
import {PlusIcon} from "./icons/PlusIcon.tsx";
import {ShareIcon} from "./icons/ShareIcon.tsx";

function App() {
    return (
        <div>
            <Button variant={"primary"} size={"sm"} text={"Add Content"} onClick={()=>console.log("clicked")} startIcon={<PlusIcon/>} endIcon={""} />
            <Button variant={"secondary"} size={"sm"} text={"Share Content"} onClick={()=>console.log("clicked")} startIcon={<ShareIcon/>} endIcon={""} />

        </div>
    );
}

export default App;