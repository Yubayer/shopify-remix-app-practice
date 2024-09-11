
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    // const sat = await admin.rest.resources.StorefrontAccessToken.all({
    //     session: session,
    // });
    // console.log("sstorefront access token: ", sat);

    const sco = await admin.rest.resources.AccessScope.all({
        session: session,
    });

    console.log("access scope: ", sco.data);

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


    const sft = await admin.rest.resources.StorefrontAccessToken.all({
        session: session,
    });

    console.log("storefront access token: ", sft.data);

    return null;
}

export const ErrorBoundary = ({ error }) => {
    console.error("error ----------------------- ", error);
    return (
        <div>
            <h1>Something went wrong</h1>
        </div>
    );
}

export default function AppStorefront() {
    return (
        <div>
            <h1>App Storefront</h1>
            <p>
                This is the App Storefront page.
            </p>
        </div>
    );
}