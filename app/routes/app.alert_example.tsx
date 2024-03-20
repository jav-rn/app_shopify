import {
    Page,
    Layout,
    Banner,
    LegacyCard,
    FormLayout,
    TextField,
    Thumbnail
  } from '@shopify/polaris';
  import React from 'react';
  import type { LoaderFunction } from "@remix-run/node";
  import { apiVersion, authenticate } from "~/shopify.server";
  import logoDropi from "../../public/avatar.png";

  import { getAllOrders } from '../../_services/manage-order-fails.service';




  export const loader: LoaderFunction = async ({ request }) => {
    const { session } = await authenticate.admin(request)
  
    //getAllOrders()
    try {
      return {}
    } catch (err) {
      console.log(err)
    }

  };


  const View = () => {

    return (
        <Page fullWidth>
        <Layout>
          <Layout.Section>

            <Thumbnail
              source={logoDropi}
              alt="Black choker necklace"
            />
          </Layout.Section>

        </Layout>
      </Page>
        );
  }

  export default View;

  function LayoutExample() {
    return (
      <Page fullWidth>
        <h1>Aca</h1>
        <Layout>
          <Layout.Section>
            <Banner title="Order archived" onDismiss={() => {}}>
              <p>This order was archived on March 7, 2017 at 3:12pm EDT.</p>
            </Banner>
          </Layout.Section>

        </Layout>
      </Page>
    );
  }