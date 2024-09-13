import { Page } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    return null;
}


export default function PriceRules() {
    return (
        <Page
            breadcrumbs={[{ content: "Home", onAction: () => { } }]}
            title="Price Rules"
        >

        </Page>
    );
}

