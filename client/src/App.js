import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Tasks from "./pages/Tasks";
import AddTask from "./pages/AddTask";
import UpdateTask from "./pages/UpdateTask";
import { ToastContainer } from "react-toastify";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/update-task/:taskId" element={<UpdateTask />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
