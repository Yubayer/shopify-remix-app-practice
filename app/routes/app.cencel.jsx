import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server"

export const loader = async ({ request }) => {
    const { admin, session, billing } = await authenticate.admin(request);

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

    return redirect("/app/pricing");
}


// export default function AppCancel() {
//     return (
//         <div>
//             <h1>App Cancel</h1>
//         </div>
//     )
// }