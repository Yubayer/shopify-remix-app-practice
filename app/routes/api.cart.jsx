import { gql, GraphQLClient } from 'graphql-request';
import { json } from "@remix-run/node"

export async function loader({ request }) {
    const cartId = "gid://shopify/Cart/Z2NwLXVzLWVhc3QxOjAxSjdFTVIxM0FEU0hSRFZNSzNaWUREWDMw?key=bee28515ddc761d28c663d25d0f5fc5c";
    const SHOPIFY_STORE_URL = "https://app-testing-dev1.myshopify.com/api/2024-07/graphql.json";

    const token = "b899fb00c0bf1492ede0fc48d377dcd9"


    // Create a GraphQL client
    const client = new GraphQLClient(SHOPIFY_STORE_URL, {
        headers: {
            'X-Shopify-Access-Token': token,

        },
    });

    const GET_CART_ITEMS_QUERY = gql`
        query getCart($cartId: ID!) {
            cart(id: $cartId) {
                checkoutUrl
                estimatedCost {
                    totalAmount {
                        amount
                        currencyCode
                    }
                    subtotalAmount {
                        amount
                        currencyCode
                    }
                    totalTaxAmount {
                        amount
                        currencyCode
                    }
                }
                totalQuantity
                buyerIdentity {
                    email
                    phone
                    countryCode
                    deliveryAddressPreferences 
                    customer{
                        id
                        displayName
                        firstName
                        lastName
                        addresses(first: 10) {
                            edges {
                                node {
                                    id
                                    address1
                                    address2
                                    city
                                    country
                                    countryCode
                                    firstName
                                    lastName
                                    phone
                                    province
                                    zip
                                }
                            }
                        }
                    }
                }
                lines(first: 10) {
                    edges {
                        node {
                            merchandise {
                                ... on ProductVariant {
                                    product {
                                        title
                                        
                                    }
                                }
                            }
                        quantity
                        }
                    }
                }
                discountCodes{
                    code
                    applicable
                }
                
            }
        }`;

    const response1 = await fetch(SHOPIFY_STORE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({ query: GET_CART_ITEMS_QUERY, variables: { cartId } }),
    });

    const data = await response1.json();
    const discountCodes = data.data.cart.discountCodes;
    const codes = discountCodes.map((code) => code.code);


    // apply discount on cart using cart token mutation
    const APPLY_DISCOUNT_MUTATION = gql`
    mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart {
            id
            discountCodes {
                code
                applicable
            }
            cost {
                totalAmount {
                amount
                currencyCode
                }
            }
            lines(first: 10) {
                edges {
                node {
                    id
                    merchandise {
                    ... on ProductVariant {
                        product {
                        title
                        }
                    }
                    }
                    quantity
                    cost {
                    totalAmount {
                        amount
                        currencyCode
                    }
                    }
                }
                }
            }
        }
        userErrors {
            field
            message
        }
    }
    }`;

    const discountVariables = {
        cartId: cartId,
        discountCodes: ["super10", ...codes]
        // discountCodes : ["super5", "super10", "super-buy", "free-ship"]
    }

    // discount response
    const discount_response = await fetch(SHOPIFY_STORE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({ query: APPLY_DISCOUNT_MUTATION, variables: discountVariables }),
    });

    const discount_data = await discount_response.json();
    //   return json({ discount_data });

    // calculate shipping rate using city and country code
    const GET_SHIPPING_RATE_QUERY = gql`
    query getShippingRates($cartId: ID!, $shippingAddress: MailingAddressInput!) {
    cartShippingRatesUpdate(cartId: $cartId, shippingAddress: $shippingAddress) {
        cart {
            id
            shippingRates {
                handle
                title
                priceV2 {
                amount
                currencyCode
                }
            }
        }
        userErrors {
            field
            message
        }
    }
    }`;

    const shippingAddress = {
        address1: "123 Oak St",
        city: "Ottawa",
        country: "Canada",
        countryCode: "CA",
        firstName: "Bob",
        lastName: "Bobsen",
        phone: "555-555-5555",
        province: "ON",
        zip: "K1M2B9",
    };

    const shippingVariables = {
        cartId: cartId,
        shippingAddress: shippingAddress,
    };

    


    return json({ codes, data, discount_data });

}
