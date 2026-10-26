import { profile, channels } from '$lib/profile';

export const load = () => {
	return {
		profile: {
			name: profile.name,
			role: profile.role,
			handle: profile.handle,
			domain: profile.domain,
			copy: profile.copy,
			operator: profile.operator
		},
		channels
	};
};
