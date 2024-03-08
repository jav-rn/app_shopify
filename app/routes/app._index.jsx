import { useEffect, useState } from "react";
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
  InlineStack, Spinner
} from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { _DropiModelProducts } from '../../_models/_DropiModelProducts';


// queryImportOneProducts
const dropiModelProducts = new _DropiModelProducts()
export const loader = async ({ request }) => {

  const product = dropiModelProducts.queryImportOneProducts(request, {}, 'products')
  if (!product) return null;
  return product;
  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  /*

  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
*/
  return json({
    product: {},
  });
};

export default function Index() {

  const loaderData = useLoaderData();
  /** loader */
  const [isLoading, setIsLoading] = useState(true);
  /******************* */

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
      <Card>
        <h2>No hay productos disponibles, favor importar</h2>
      </Card>
    );
  }

  /******************* */

  return (
    <Page>
      <Card>
        Conexión establecida a Dropi
      </Card>
    </Page>
  );
}
