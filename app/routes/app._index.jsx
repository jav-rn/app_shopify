import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";

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
  Spinner,
  Banner,
  Badge,
  Divider, Thumbnail, FullscreenBar, ButtonGroup
  , Grid, LegacyCard
} from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { _DropiModelProduct } from '../resources/_models/_DropiModelProduct';
import { NavDropi } from "./body_components/NavDropi";


// queryImportOneProducts
const dropiModelProduct = new _DropiModelProduct()
export const loader = async ({ request }) => {

  const product = dropiModelProduct.queryImportOneProducts(request, {}, 'products')
  if (!product) return null;
  return product;
  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  return json({
    product: {},
  });
};

export default function Index() {

  const loaderData = useLoaderData();
  /** loader */
  const [isLoading, setIsLoading] = useState(true);
  /******************* */
  /*** banner **** */
  const [bannerVisible, setBannerVisible] = useState(true);

  const handleBannerDismiss = () => {
    setBannerVisible(false);
  };
  /******************************** */

  /** loader */
  useEffect(() => {
    if (loaderData) {
      setIsLoading(false);
    }
  }, [loaderData]);
  if (isLoading) {
    // Mostrar el loader mientras se carga la consulta
    return (
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} >
          <Spinner size="large" />
        </div>
      </Card>
    );
  }

  if (!loaderData || !loaderData.products) {
    return (
      <Page fullWidth>
        <Card>
          <Layout>
            <Layout.Section>
              {bannerVisible && (
                <Banner title="Estado de conexion" onDismiss={handleBannerDismiss}>
                  <p>No hay productos importados</p>
                </Banner>
              )}
            </Layout.Section>
          </Layout>
        </Card>
      </Page>
    );
  }

  /******************* */

  return (
    <Page fullWidth>
      <NavDropi/>
      <Card>
        <Layout>
          <Layout.Section>
            {bannerVisible && (
              <Banner title="Estado de conexión" onDismiss={handleBannerDismiss}>
                <p>Establecida con Dropi</p>
              </Banner>
            )}
          </Layout.Section>
          <Layout.Section>
            <BlockStack gap="500">
              <Text as="h1" variant="headingSm"> Paso 1: </Text>
              Importar los productos desde app Dropify
              <Divider borderColor="border" />
              <Text as="h1" variant="headingSm">Paso 2: </Text>
              Validar que la conexión este establecida
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Card>
    </Page>
  );
}
