import { json, redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { Link, useLoaderData, useFetcher, useActionData, useSubmit, Form } from "@remix-run/react";
import { Page, Text, LegacyCard, TextField, Button } from "@shopify/polaris";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";
import { useAppBridge, Modal, TitleBar } from "@shopify/app-bridge-react";
import { useState } from "react";

import createWebhook from "../components/wehbooks/createWehbook";

export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);

    const webhooksResponse = await admin.rest.resources.Webhook.all({
        session: session,
    });
    const webbooks = webhooksResponse.data;
    const appURL = process.env.APP_URL;
    return json({ webbooks, appURL });
};

export const action = async ({ request }) => {
    const method = request.method;
    const { admin, session } = await authenticate.admin(request);
    const formData = await request.formData();

    if (method === "DELETE") {
        const id = formData.get("id");
        const webhook = new admin.rest.resources.Webhook({ session: session });
        webhook.id = id;
        await webhook.delete();
        return json({
            message: "Webhook deleted",
            topic: webhook.topic,
            status: "success",
        });

    }
    if (method === "POST") {
        const topic = formData.get("topic");
        let data = await createWebhook(topic, admin);
        return json({
            message: "Webhook Created",
            topic: topic,
            status: "success",
        });
    }

    if (method === "PUT") {
        const id = formData.get("id");
        const appURL = process.env.APP_URL;
        const webhook = new admin.rest.resources.Webhook({ session: session });
        webhook.id = id;
        webhook.address = `${appURL}/webhooks`;
        await webhook.save({
            update: true,
        });
    }

    return redirect("/app/webhooks");
}

export const ErrorBoundary = ({ error }) => {
    return (
        <Page title="Error">
            <Text>Error occoured</Text>
        </Page>
    );
}

export default function webhooks() {
    const { webbooks, appURL } = useLoaderData();
    const actionData = useActionData();
    const submit = useSubmit();
    const shopify = useAppBridge();
    const fetcher = useFetcher();

    const [topic, setTopic] = useState("SHOP_UPDATE");

    if (actionData?.status === "success") {
        shopify.toast.show(actionData.message);
        shopify.modal.hide('my-modal');
    }

    const deleteWebhook = async (id) => {
        const formData = new FormData();
        formData.append("id", id);
        submit(formData, { method: "delete" });
    }

    const handleTopicChange = (value) => {
        setTopic(value);
    }

    return (
        <Page
            title="Webhooks"
            breadcrumbs={[{ content: "Home", url: "/app" }]}
            subtitle="Registered webhooks"
            backAction={{ content: "Back", onAction: () => history.back() }}
            secondaryActions={[
                {
                    content: "Update Webhooks",
                    url: "/app/webhooks/update",
                },
                {
                    content: "Create Webhooks",
                    onAction: () => shopify.modal.show('my-modal'),
                }
            ]}
        >
            {webbooks.length > 0 ? (
                webbooks.map((webhook) => (
                    <LegacyCard key={webhook.id}>
                        <LegacyCard.Section title={webhook.topic} actions={[
                            {
                                onAction: () => submit({ id: webhook.id }, { method: "put" }),
                                icon: EditIcon,
                            },
                            {
                                destructive: true,
                                icon: DeleteIcon,
                                onAction: deleteWebhook.bind(null, webhook.id),
                            },
                        ]}>
                            <Text>
                                <Link to={`${appURL}/app/webhooks/${webhook.id}`}>
                                    {webhook.topic}
                                </Link>
                            </Text>
                            <Text as="p">{webhook.id}</Text>
                            <Text as="p">{webhook.address}</Text>
                        </LegacyCard.Section>
                    </LegacyCard>
                ))
            ) : (
                <Text>No webhooks registered</Text>
            )}
            <Modal id="my-modal">
                <Form method="POST">
                    <TextField
                        value={topic}
                        name="topic"
                        onChange={handleTopicChange}
                        label="Topic"
                        type="text"
                        autoComplete="topic"
                    />
                    <Button type="submit">Save</Button>
                </Form>
                <TitleBar title="Title">
                    <button onClick={() => shopify.modal.hide('my-modal')}>Close</button>
                </TitleBar>
            </Modal>
        </Page>
    );
}