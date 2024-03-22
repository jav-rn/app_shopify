import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Card, Layout, List, Page, DataTable, Thumbnail, useIndexResourceState, Button, TextField, Spinner } from "@shopify/polaris";
import { getPaginationVariables, Pagination } from '@shopify/hydrogen';
import { apiVersion, authenticate } from "~/shopify.server";
//import { _DropiModelOrder } from "_models/_DropiModelOrder";
import { _DropiModelProduct } from "_models/_DropiModelProduct";
import React, { useState, useEffect } from 'react';
import { _DropiModelShop } from "../../_models/_DropiModelShop";
import { NavDropi } from "./body_components/NavDropi";
import { _DropiServices } from "_services/dropi.services";
//import { NavDropi } from './NavDropi'

const dropiModelProduct = new _DropiModelProduct();

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request)
  const variables = getPaginationVariables(request, {
    pageBy: 4,
    searchTerm: '' // Inicialmente no hay término de búsqueda
  });

  try {
    let resp = await dropiModelProduct.queryImportProducts(request, variables, 'products');
    return resp
  } catch (err) {
    console.log(err)
  }
};

const   dropiServices = new _DropiServices();
const Products = () => {

  let d= dropiServices.login();
  console.log("login--->>>",d)

  /** loader */
  const [isLoading, setIsLoading] = useState(true);
  /******************* */

  const loaderData = useLoaderData();
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
  /******************* */

  if (!loaderData || !loaderData.products) {
    return (
      <Card>
        <h2>No hay productos disponibles, favor importar o recargar la página</h2>
      </Card>
    );
  }

  const { products } = loaderData;

  console.log(products, "products")

  // Mapear los productos para crear las filas de la tabla
  const rows = products.nodes.map(product => {
    const imageSrc = product.images.edges[0]?.node.originalSrc || '';
    const sku = product.variants.edges[0]?.node.sku || '';
    const price = product.variants.edges[0]?.node.price || '';
    const collection = product.collections.edges[0]?.node.title || '';
    const stock = product.variants.edges[0]?.node.inventoryQuantity || '';

    return {
      imageSrc: imageSrc,
      title: product.title || '',
      description: product.description || '',
      sku: sku,
      stock: stock,
      id: product.id || '',
      price: price,
      category: collection,
    };
  });


  return (
    <div>
      <Page fullWidth>
        <NavDropi />
        <Card>
          <h1>Productos</h1>
          <DataTable
            columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text']}
            headings={['Disponible a venta', 'Imagen', 'Nombre', 'SKU', 'Stock', 'price', 'Categoria', 'Descripción', 'ID']}
            rows={rows.map((product: any) => [
              <input
                type="checkbox"
              />,

              <div>
                <Thumbnail source={product.imageSrc} alt={product.title} size="large" />
              </div>,
              <div>{product.title}</div>,
              <div>{product.sku}</div>,
              <div>{product.stock}</div>,
              <div>{product.price}</div>,
              <div>{product.category}</div>,
              <div
                style={{
                  maxHeight: '100px',
                  overflow: 'auto',
                  padding: '5px',
                  whiteSpace: 'normal',
                }}
              >{product.description}</div>,
              <div>{product.id}</div>,
            ])}
          />

          <Pagination connection={products}>
            {({ NextLink, PreviousLink, isLoading }) => (
              <>
                <PreviousLink>
                  <Button disabled={isLoading} >
                    {isLoading ? 'Cargando...' : '<'}
                  </Button>
                </PreviousLink>
                <NextLink>
                  <Button disabled={isLoading} >
                    {isLoading ? 'Cargando...' : '>'}
                  </Button>
                </NextLink>
              </>
            )}
          </Pagination>

        </Card>

      </Page>

    </div>

  );
};

export default Products;

