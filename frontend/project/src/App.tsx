import {Button} from "./components/Button.tsx";
import {PlusIcon} from "./icons/PlusIcon.tsx";
import {ShareIcon} from "./icons/ShareIcon.tsx";


function App() {
    return (
        <div>
            <Button startIcon={<PlusIcon size={"md"}/>} title={"Add Content"} variant={"primary"} size={"sm"}/>
            <Button startIcon={<ShareIcon size={"md"}/>} title={"Share"} variant={"secondary"} size={"sm"}/>
        </div>
    );
}

export default App;