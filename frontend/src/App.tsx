import { AppRouter, Routes } from 'auth-react-router';
import { BrowserRouter } from 'react-router-dom';
import { routes } from './routes/routes';

function App() {
	const isAuth = true;

	return (
		<BrowserRouter>
			<AppRouter isAuth={true} routes={routes}>
				<Routes />
			</AppRouter>
		</BrowserRouter>
	);
}

export default App;
