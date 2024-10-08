import { redirect } from '@remix-run/node';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
    const { admin, session, billing } = await authenticate.admin(request);
    return redirect('/app/subscription');
}
