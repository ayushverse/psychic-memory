import Button from "./components/Button.tsx";

function App() {
    return (
        <div>
            <Button variant={"primary"} size={"sm"} text={"Add Content"} onClick={()=>console.log("clicked")} startIcon={"+"} endIcon={"-"} />
        </div>
    );
}

export default App;