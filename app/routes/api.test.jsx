import { json, redirect } from "@remix-run/node";
import db from "../db.server";

import { createAdminApiClient, createAdminRestApiClient } from '@shopify/admin-api-client';




export const loader = async ({ request }) => {
    const shop = "app-testing-dev1.myshopify.com";
    const shopData = await db.session.findFirst({
        where: {
            shop: shop,
        },
    });
    const accessToken = shopData.accessToken;

    try {
        const SHOPIFY_API_VERSION = "2024-07";
        const SHOPIFY_ACCESS_TOKEN = accessToken;
        const SHOPIFY_STORE = shop;

        const client = createAdminRestApiClient({
            storeDomain: shop,
            apiVersion: '2024-07',
            accessToken: accessToken,
        })

        const response = await client.get("shop.json");
        // const response = await client.put("products/7325322182679.json",
        //     {
        //       data: {
        //         product: {
        //           handle: "my-new-handle1",
        //           image: {
        //             alt: "A new image",
        //             src: "http://example.com/new-image.jpg",
        //           },
        //         }
        //       }
        //     }
        //   );

        if (response.ok) {
            const body = await response.json();
            return json({ data: body });
        }

    } catch (error) {
        console.error(error);
        return json({ error: "Failed to fetch products" }, { status: 500 });
    }
};
export const action = async ({ request }) => {
    const formData = new URLSearchParams(await request.text());
    const data = Object.fromEntries(formData);

    const shop = "app-testing-dev1.myshopify.com";
    const shopData = await db.session.findFirst({
        where: {
            shop: shop,
        },
    });
    const accessToken = shopData.accessToken;

    await authenticate.admin(request);



    console.log("data admin-----------------", request);

    return json({ message: "Hello, world!" });
}; 