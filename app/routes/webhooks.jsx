import { authenticate } from "../shopify.server";
import db from "../db.server";

import shopUpdate from "../components/wehbooks/shopUpdate";

export const action = async ({ request }) => {
  const { topic, shop, session, admin } = await authenticate.webhook(request);

  if (!admin && topic !== "SHOP_REDACT") {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    // The SHOP_REDACT webhook will be fired up to 48 hours after a shop uninstalls the app.
    // Because of this, no admin context is available.
    throw new Response();
  }

  console.log(`Webhook received---------------: ${topic}`);

  // The topics handled here should be declared in the shopify.app.toml.
  // More info: https://shopify.dev/docs/apps/build/cli-for-apps/app-configuration
  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {

        // get shop data
        
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "SHOP_UPDATE":
      await shopUpdate(shop, request);
      break;
    case "CUSTOMERS_DATA_REQUEST":
      console.log("Customer data request received-----------------");
      break;
    case "CUSTOMERS_REDACT":
      console.log("Customer redact received-----------------");
      break;
    case "SHOP_REDACT":
      console.log("Shop redact received-----------------");
      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
