import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Card, Layout, List, Page, DataTable, Thumbnail, useIndexResourceState, Button, TextField } from "@shopify/polaris";
import { getPaginationVariables, Pagination } from '@shopify/hydrogen';
import { apiVersion, authenticate } from "~/shopify.server";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { json } from '@shopify/remix-oxygen';
import { _OrderServices } from "stock_ago_services/order.services";

const ITEMS_PER_PAGE = 10;
export const query = `
query AllProducts(
  $first: Int
  $last: Int
  $startCursor: String
  $endCursor: String
  ) {
  products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
    nodes {
      id
      title
      description
      images(first: 1) {
        edges {
          node {
            originalSrc
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            sku
            inventoryQuantity
            price
          }
        }
      }
      collections(first: 1) {
        edges {
          node {
            title
          }
        }
      }
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
  }
}
`;

/* ejemplo de uso para service_new_order */
const orderServices = new _OrderServices(); // Instanciar la clase _OrderService 
/*************************************** */


export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request)
  const { shop, accessToken } = session;
  const query_base_url = `https://${shop}/admin/api/${apiVersion}/graphql.json`;

  const variables = getPaginationVariables(request, {
    pageBy: 4,
   searchTerm: '' // Inicialmente no hay término de búsqueda
  });
  /* ejemplo de uso para service_new_order */
  let resp = orderServices.send_create_order({"test":"test de envio de data a server externo"});
  /*************************************** */

  try {
    const response = await fetch(query_base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken!
      },
      body: JSON.stringify({
        query: query,
        variables: variables// Initial request fetches first 10 products
      })
    });

    if (response.ok) {

      const data = await response.json()
      // console.log(data, 'old_data')


      const { data: { products } } = data;

      //console.log(products, 'data__')
      return {
        products: products
      }
    }


    return null
  } catch (err) {
    console.log(err)
  }
};



const Products = () => {
  const { products } = useLoaderData();
    // console.log(products, 'products')

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

  console.log(rows, 'rowss')




  return (
    <Card>
      <h1>Productos</h1>
            <DataTable
        columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text']}
        headings={['Disponible a venta', 'Imagen', 'Nombre', 'SKU', 'Stock', 'price', 'Categoria', 'Descripción', 'ID']}
        rows={rows.map((product: any) => [
          <input
            type="checkbox"
          // onChange={() => handleCheckboxChange(product.id)}
          // checked={selectedItems.includes(product.id)}
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
              <Button disabled={isLoading} outline>
                {isLoading ? 'Cargando...' : '<'}
              </Button>
            </PreviousLink>
            <NextLink>
              <Button disabled={isLoading} outline>
                {isLoading ? 'Cargando...' : '>'}
              </Button>
            </NextLink>
          </>
        )}
      </Pagination>

    </Card>
  );
};

export default Products;

