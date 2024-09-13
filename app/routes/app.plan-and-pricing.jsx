import React from "react";

import { redirect, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, LegacyCard, Badge } from "@shopify/polaris";
import {  authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    // const store = session.shop;
    // const storeName = store.replace('.myshopify.com', '');
    // const appName = 'practice-114'

    // const { hasActivePayment, appSubscriptions } = await billing.check({
    //     plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    //     onFailure: async () => console.log("Failed to check billing status")
    // });
    // console.log("hasActivePayment: ",hasActivePayment)
    // console.log("appSubscriptions: ",appSubscriptions)

    // return json({ hasActivePayment, appSubscriptions });

    // await billing.require({
    //     plans: [ANNUAL_PLAN],
    //     onFailure: async () => billing.request({
    //         plan: ANNUAL_PLAN,
    //         isTest: true,
    //         returnUrl: `https://admin.shopify.com/store/${storeName}/apps/${appName}/app/pricing`,
    //     }),
    // });

    return null;
}

export default function PlanAndPricing() {
    // const loaderData = useLoaderData();
    // const { hasActivePayment, appSubscriptions } = loaderData;
    // console.log("loaderData: ", appSubscriptions[0], appSubscriptions[0].lineItems[0])
    return (
        <Page
            backAction={{ content: 'Products', url: '#' }}
            title="3/4 inch Leather pet collar"
            titleMetadata={<Badge tone="success">Paid</Badge>}
            subtitle="Perfect for any pet"
            compactTitle
            primaryAction={{ content: 'Save'}}
            secondaryActions={[
                {
                    content: 'Duplicate',
                    accessibilityLabel: 'Secondary action label',
                    onAction: () => alert('Duplicate action'),
                },
                {
                    content: 'View on your store',
                    onAction: () => alert('View on your store action'),
                },
            ]}
            actionGroups={[
                {
                    title: 'Promote',
                    actions: [
                        {
                            content: 'Share on Facebook',
                            accessibilityLabel: 'Individual action label',
                            onAction: () => alert('Share on Facebook action'),
                        },
                    ],
                },
            ]}
            pagination={{
                hasPrevious: true,
                hasNext: true,
            }}
        >
            <LegacyCard title="Credit card" sectioned>
                <p>Credit card information</p>
            </LegacyCard>
        </Page>
    )
}

