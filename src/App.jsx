import React from "react";
import { Routes, Route } from "react-router-dom";

import Main from "./Main";
import Settings from "./Settings";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="settings" element={<Settings />} />
		</Routes>
	);
}

export default App;
