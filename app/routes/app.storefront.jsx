
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { Page } from "@shopify/polaris";

export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    // const sat = await admin.rest.resources.StorefrontAccessToken.all({
    //     session: session,
    // });
    // console.log("sstorefront access token: ", sat);

    // const sco = await admin.rest.resources.AccessScope.all({
    //     session: session,
    // });


    // const response = await admin.graphql(
    //     `#graphql
    //         mutation StorefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
    //             storefrontAccessTokenCreate(input: $input) {
    //             userErrors {
    //                 field
    //                 message
    //             }
    //             shop {
    //                 id
    //             }
    //             storefrontAccessToken {
    //                 accessScopes {
    //                 handle
    //                 }
    //                 accessToken
    //                 title
    //             }
    //             }
    //         }`,
    //     {
    //         variables: {
    //             "input": {
    //                 "title": "New Storefront Access Token"
    //             }
    //         },
    //     },
    // );

    // const data = await response.json();


    const storefrontAccessToken = await admin.rest.resources.StorefrontAccessToken.all({
        session: session,
    });

    return json({ storefrontAccessToken });
}

export const ErrorBoundary = ({ error }) => {
    return (
        <div>
            <h1>Something went wrong</h1>
        </div>
    );
}

export default function AppStorefront() {
    return (
        <Page
            breadcrumbs={[{ content: "Home", url: "/app" }]}
            title="Storefront Access Token"
        >

        </Page>
    );
}