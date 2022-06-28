// routes.tsx
import { IRoutesConfig } from 'auth-react-router';
// private lazy loaded pages
//const LazyPrivatePage = React.lazy(() => import('../pages/PrivatePage.tsx'));


export const routes: IRoutesConfig = {
	publicRedirectRoute: '/profile',
	privateRedirectRoute: '/login',
	defaultFallback: <></>,
	public: [
		{
			path: '/public',
			component: <p>ola</p>,
		},
		{
			path: '/login',
			component: <p>login</p>,
		},
	],
	private: [
		{
			path: '/private',
			component: <p>autenticado</p>,
		},
		{
			path: '/profile',
			component: <p>autenticado</p>,
		},
	],
	common: [
		{
			path: '/',
			component: <p>common</p>,
		},
		{
			path: '*',
			component: <p>page not found 404</p>,
		},
	],
};
