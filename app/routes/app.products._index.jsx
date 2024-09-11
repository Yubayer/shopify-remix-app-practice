import {
  BlockStack,
  Card,
  InlineGrid,
  Layout,
  LegacyCard,
  Page,
  ResourceList,
  Avatar,
  ResourceItem,
  Text,
  FormLayout,
  TextField,
  Button
} from "@shopify/polaris";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";
import { useAppBridge, Modal, TitleBar } from "@shopify/app-bridge-react";
import { useEffect } from "react";
import { authenticate } from "../shopify.server";
import { useState } from "react";
import { redirect, useActionData, useSubmit, Form } from "@remix-run/react"
import { json } from "@remix-run/node";

const Products = () => {
  const shopify = useAppBridge();
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editProduct, setEditProduct] = useState({});
  let [editFields, setEditFields] = useState({
    title: "",
    handle: "",
  });
  let [createFields, setCreateFields] = useState({
    title: "",
    handle: "",
  });
  const submit = useSubmit();
  const actionData = useActionData();

  useEffect(() => {
    if (actionData && actionData.type === "toast") {
      let message = actionData.message || "Action completed";
      shopify.toast.show(actionData.message, {
        duration: actionData.duration,
        status: actionData.status,
      });
      if (actionData && actionData.id) {
        let findProduct = selectedProducts.find((product) => product.id === actionData.id);
        if (findProduct) {
          if (actionData.method === "put") {
            findProduct.title = editFields.title;
            findProduct.handle = editFields.handle;
          }
          if (actionData.method === "delete") {
            let index = selectedProducts.findIndex((product) => product.id === actionData.id);
            selectedProducts.splice(index, 1);
          }
          if (actionData.method === 'post') {
            shopify.modal.hide('product-create-modal')
          }
          setSelectedProducts([...selectedProducts]);
        }
      }
    }



  }, [actionData]);

  useEffect(() => {
    async function func() {
      if (showResourcePicker) {
        const selected = await shopify.resourcePicker({
          type: 'product',
          action: "select",
          multiple: true,
          filter: {
            hidden: true,
            variants: false,
            draft: false,
            archived: false,
          }
        });
        if (selected) {
          setShowResourcePicker(false)
          setSelectedProducts([...selected.selection]);
        } else {
          setShowResourcePicker(false);
        }
      }
    }
    func();
  }, [showResourcePicker, selectedProducts]);


  const handleDeleteProduct = async (id) => {
    const formData = new FormData();
    formData.append("id", id);
    submit(formData, { method: "delete" });
  }

  const handleEditProduct = (item) => {
    setEditProduct(item);
    setEditFields({
      title: item.title,
      handle: item.handle,
    });
    shopify.modal.show('my-modal');
  }

  const handleEditInput = (value, name) => {
    if (name === "handle") {
      value = value.replace(/\s+/g, '-').toLowerCase();
    }
    setEditFields((fields) => {
      return {
        ...fields,
        [name]: value
      }
    });
  }

  const handleUpdateProduct = async () => {
    shopify.modal.hide('my-modal');
    const { id } = editProduct;
    const { title, handle } = editFields;
    const formData = new FormData();

    formData.append("id", id);
    formData.append("title", title);
    formData.append("handle", handle);

    submit(formData, { method: "put" });
  }

  const handleCreateProduct = async () => {
    const formData = new FormData();
    formData.append('title', createFields.title)

    submit(formData, { method: 'POST' })
  }

  const handleCreateProdictInput = (value, name) => {
    setCreateFields((fields) => {
      return {
        ...fields,
        [name]: value
      }
    });
  }

  return (
    <Page
      title="Products"
      primaryAction={{
        content: "Select Product",
        onAction: () => setShowResourcePicker(!showResourcePicker),
        loading: showResourcePicker,
      }}
      secondaryActions={[
        {
          content: "Create Product",
          onAction: () => shopify.modal.show('create-product-modal'),
        },
      ]}
      backAction={[
        {
          content: "Back",
          onAction: () => redirect("/app"),
        },
      ]}
    >

      <LegacyCard>
        <ResourceList
          resourceName={{ singular: 'product', plural: 'products' }}
          items={selectedProducts}

          renderItem={(item) => {
            const { id, title, handle, variants } = item;
            const mediaSrc = item.images[0]?.originalSrc || null;
            const price = variants[0].price;
            const media = <Avatar product size="xl" name={title} source={mediaSrc} />;

            return (
              <ResourceItem
                id={id}
                media={media}
                accessibilityLabel={`View details for ${title}`}
                shortcutActions={
                  [
                    { content: 'Edit', icon: EditIcon, onAction: handleEditProduct.bind(null, item) },
                    { content: 'Delete', icon: DeleteIcon, onAction: handleDeleteProduct.bind(null, id), loading: true }
                  ]
                }
              >
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                  {title}
                </Text>
                <div>{handle}</div>
                <div>{price}</div>
              </ResourceItem>
            );
          }}
        />
      </LegacyCard>

      {/* update product modal */}
      <Modal id="my-modal">
        <Form method="put" style={{ padding: '20px' }}>
          <FormLayout>
            <TextField name="title" label="Title" onChange={(event) => handleEditInput(event, 'title')} autoComplete="off" value={editFields.title} />
            <TextField name="handle" label="Handle" onChange={(event) => handleEditInput(event, 'handle')} autoComplete="off" value={editFields.handle} />
          </FormLayout>
        </Form>
        <TitleBar title="Edit Product Form">
          <button variant="primary" onClick={() => handleUpdateProduct()}>Update</button>
          <button onClick={() => shopify.modal.hide('my-modal')}>Close</button>
        </TitleBar>
      </Modal>

      {/* create product modal */}
      <Modal id="create-product-modal">
        <Form method="post" style={{ padding: '20px' }}>
          <FormLayout>
            <TextField name="title" label="Title" onChange={(event) => handleCreateProdictInput(event, 'title')} autoComplete="off" value={createFields.title} />
            <TextField name="handle" label="Handle" onChange={(event) => handleCreateProdictInput(event, 'handle')} autoComplete="off" value={createFields.handle} />
          </FormLayout>
        </Form>
        <TitleBar title="Create Product Form">
          <button variant="primary" onClick={() => handleCreateProduct()}>Create</button>
          <button onClick={() => shopify.modal.hide('create-product-modal')}>Close</button>
        </TitleBar>
      </Modal>
    </Page>
  );
}

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  return null;
}

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const method = request.method;

  if (method === "DELETE") {
    const id = formData.get("id");
    const response = await admin.graphql(
      `#graphql
      mutation {
        productDelete(input: {id: "${id}"}) {
          deletedProductId
          userErrors {
            field
            message
          }
        }
      }`,
    );

    const data = await response.json();
    if (data.errors) {
      return json({
        type: 'toast',
        message: 'Product deleted',
        duration: 5000,
        stauts: 'success',
        id: id,
        method: 'delete'
      });
    } else {
      return json({
        type: 'toast',
        message: 'Product deleted',
        duration: 5000,
        stauts: 'success'
      });
    }
  }

  if (method === "PUT") {
    //update product
    const title = formData.get("title");
    const handle = formData.get("handle");
    const id = formData.get("id");
    const response = await admin.graphql(
      `#graphql
      mutation {
        productUpdate(input: {id: "${id}", title: "${title}", handle: "${handle}"}) {
          product {
            id
            title
            handle
          }
          userErrors {
            field
            message
          }
        }
      },`,
    );

    const data = await response.json();
    if (data.errors) {
      return json({
        type: 'toast',
        message: 'Product updated',
        duration: 5000,
        stauts: 'success'
      });
    } else {
      return json({
        type: 'toast',
        message: 'Product updated',
        duration: 5000,
        stauts: 'success',
        id: id,
        method: 'put'
      });
    }
  }

  if (method === "POST") {
    //create product
    const title = formData.get("title");
    const status = "active";

    const response = await admin.graphql(
      `#graphql
      mutation createProductMetafields($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
          }
          userErrors {
            message
            field
          }
        }
      }`,
      {
        variables: {
          "input": {
            "title": title
          }
        },
      },
    );

    const data = await response.json();

    if (data.errors) {
      return json({
        type: 'toast',
        message: 'Product created',
        duration: 5000,
        stauts: 'success',
        method: 'post'
      });
    } else {
      return json({
        type: 'toast',
        message: 'Product created Successfully',
        duration: 5000,
        stauts: 'success',
        method: 'post'
      });
    }
  }

  return null;
}

export const ErrorBoundary = ({ error }) => {
  return (
    <Page title="Error">
      <Text>Error occoured</Text>
    </Page>
  );
}

export default Products;