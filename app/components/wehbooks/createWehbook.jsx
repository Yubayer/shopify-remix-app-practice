const createWebhook = async (topic, admin) => {
    const response = await admin.graphql(
      `#graphql
        mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
          webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
            webhookSubscription {
              id
              topic
              format
              endpoint {
                __typename
                ... on WebhookHttpEndpoint {
                  callbackUrl
                }
              }
            }
          }
        }`,
      {
        variables: {
          "topic": topic,
          "webhookSubscription": {
            "callbackUrl": `${process.env.APP_URL}/webhooks`,
            "format": "JSON"
          }
        },
      },
    );

    const data = await response.json();

    return data.data.webhookSubscriptionCreate.webhookSubscription;
}

export default createWebhook;