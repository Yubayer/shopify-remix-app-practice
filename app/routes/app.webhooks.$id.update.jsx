import { Page } from '@shopify/polaris';
import { authenticate } from '../shopify.server';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request, params }) => {
    const { admin, session } = await authenticate.admin(request);
    const id = params.id;
    const appURL = process.env.APP_URL;

    const webhook = new admin.rest.resources.Webhook({ session: session });

    webhook.id = id;
    webhook.address = `${appURL}/webhooks`;
    await webhook.save({
        update: true,
    });

    console.log('webhook updated');
    return redirect(`/app/webhooks`);

}

export default function updateWehbooks() {
    const { id } = useLoaderData();
    return (
        <Page
            title='Update Webhooks'
            subtitle={`Update ${id} webhooks`}
            breadcrumbs={[{ content: 'Home', url: '/app' }, { content: 'Webhooks', url: '/app/webhooks' }]}
            backAction={{ content: 'Back', url: '/app/webhooks' }}
        >

        </Page>
    );
}