import { useEffect } from "react";
import { json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { NavLink } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  // return redirect("/app/products");
  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
 
  return json({ message: "Webhook created" });
};

export default function Index() {

  return (
    <Page
      breadcrumbs={[{ content: "Home", onAction: () => {} }]}
      title="Home"
    >

    </Page>
  );
}
