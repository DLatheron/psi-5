import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import icon from "../../assets/icon.svg";
import { MapComponent } from "./components/MapComponent/MapComponent";
import "./App.css";

function Hello() {
    return (
        <MapComponent />
    );
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Hello />} />
            </Routes>
        </Router>
    );
}
