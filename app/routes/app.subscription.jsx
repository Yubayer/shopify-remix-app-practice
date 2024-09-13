import { authenticate } from "../shopify.server";

import { json, redirect, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { EditIcon, ArrowUpIcon } from '@shopify/polaris-icons';
import { Page, Box, Grid, LegacyCard, Card, Button, Text, ButtonGroup } from "@shopify/polaris";

const MONTHLY_PLAN = 'Monthly subscription';
const ANNUAL_PLAN = 'Annual subscription';
const plansData = [
    {
        "name": "Free",
        "amount": 0,
        "currencyCode": 'USD',
        "interval": 'Free',
        "charge": "Free",
        "isTest": true,
        "upgrade_url": "/app/upgrade?plan=free"
    },
    {
        "name": MONTHLY_PLAN,
        "amount": 5,
        "currencyCode": 'USD',
        "interval": 'Every30Days',
        "charge": "Every 30 days",
        "isTest": true,
        "upgrade_url": "/app/upgrade?plan=monthly"
    },
    {
        "name": ANNUAL_PLAN,
        "amount": 50,
        "currencyCode": 'USD',
        "interval": 'Annual',
        "charge": "Once a year",
        "isTest": true,
        "upgrade_url": "/app/upgrade?plan=annual"
    }
]

export const loader = async ({ request }) => {
    const { admin, billing } = await authenticate.admin(request);

    const { hasActivePayment, appSubscriptions } = await billing.check({
        plans: [MONTHLY_PLAN, ANNUAL_PLAN],
        isTest: true,
    });

    return json({ hasActivePayment, appSubscriptions });
}

export const action = async ({ request }) => {
    const { admin, session, billing } = await authenticate.admin(request);
    const store = session.shop;
    const storeName = store.replace('.myshopify.com', '');
    const appName = 'practice-114'
    const returnUrl = `https://admin.shopify.com/store/${storeName}/apps/${appName}/app/subscription`;

    const formData = await request.formData();
    const plan = formData.get('plan');
    const type = formData.get('type');

    if (type === 'upgrade') {
        await billing.require({
            plans: [plan],
            onFailure: async () => billing.request({
                plan,
                isTest: true,
                returnUrl,
            }),
        });
    }

    if (type === 'cancel') {
        const billingCheck = await billing.require({
            plans: [MONTHLY_PLAN, ANNUAL_PLAN],
            onFailure: async () => billing.request({ plan: MONTHLY_PLAN }),
        });

        const subscription = billingCheck.appSubscriptions[0];

        const cancelledSubscription = await billing.cancel({
            subscriptionId: subscription.id,
            isTest: true,
            prorate: true,
        });
    }


    return redirect('/app/subscription');
}

export const ErrorBoundary = async ({ error }) => {
    return <div>Something went wrong</div>;
}

export default function Subscription() {
    const submit = useSubmit();
    const [plans, setPlans] = useState(plansData);
    const [activepayment, setActivePayment] = useState(false);
    const [activePlan, setActivePlan] = useState(null);
    const loaderData = useLoaderData();
    const actionData = useActionData();

    const { hasActivePayment, appSubscriptions } = loaderData;

    useEffect(() => {
        setActivePayment(hasActivePayment);

        if (appSubscriptions.length > 0) {
            setActivePlan(appSubscriptions[0]);
        } else {
            setActivePlan(plans[0]);
        }

    }, [hasActivePayment, appSubscriptions]);

    console.log("activepayment: ", activepayment);
    console.log("activePlan: ", activePlan);

    const handleUpgrade = (plan) => {
        const formData = new FormData();
        formData.append('plan', plan);
        formData.append('type', 'upgrade');
        submit(formData, { method: 'post' });
    }

    const handleCancelPlan = (plan) => {
        const formData = new FormData();
        formData.append('plan', plan);
        formData.append('type', 'cancel');
        submit(formData, { method: 'post' });
    }

    return (
        <Page
            title="Subscription"
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
        >
            <Grid background="bg-surface-success">
                <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                    <Card sectioned>
                        <Box>
                            <p>Upgrade your plan to access more features.</p>
                        </Box>
                        <Box>
                            <Grid>
                                {plans.map((plan, index) => {
                                    return (
                                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }} key={index}>
                                            <Card title={plan.name} background={activePlan && plan.name === activePlan.name ? "bg-surface-success" : ""} sectioned>
                                                <Box>
                                                    <Text variant="headingMd" as="h4">{plan.name} plan</Text>
                                                    <p>Price: ${plan.amount} {plan.currencyCode} / {plan.charge}</p>
                                                </Box>
                                                {plan.name !== 'Free' &&
                                                    <Box>
                                                        {activePlan && plan.name === activePlan.name ?
                                                            <ButtonGroup>
                                                                <Button onClick={() => handleUpgrade(plan.name)}>Upgrade</Button>
                                                                <Button onClick={() => handleCancelPlan(plan.name)}>Cancel</Button>
                                                            </ButtonGroup> :
                                                            <Button onClick={() => handleUpgrade(plan.name)}>Upgrade</Button>
                                                        }
                                                    </Box>
                                                }
                                            </Card>
                                        </Grid.Cell>
                                    )
                                })}
                            </Grid>
                        </Box>
                    </Card>
                </Grid.Cell>

            </Grid>
        </Page>
    )
}