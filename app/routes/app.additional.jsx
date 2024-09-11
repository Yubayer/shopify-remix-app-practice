import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  // const response = await admin.graphql(
  //   `#graphql
  //     mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
  //       webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
  //         webhookSubscription {
  //           id
  //           topic
  //           format
  //           endpoint {
  //             __typename
  //             ... on WebhookHttpEndpoint {
  //               callbackUrl
  //             }
  //           }
  //         }
  //       }
  //     }`,
  //   {
  //     variables: {
  //       "topic": "APP_UNINSTALLED",
  //       "webhookSubscription": {
  //         "callbackUrl": `${process.env.APP_URL}/webhooks`,
  //         "format": "JSON"
  //       }
  //     },
  //   },
  // );

  // const data = await response.json();

  // console.log('data-------', data.data.webhookSubscriptionCreate.webhookSubscription);

  return null;
}

export default function AdditionalPage() {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Text as="h1">Aditional Page</Text>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
