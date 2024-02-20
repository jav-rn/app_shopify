import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, Layout, List, Page, DataTable, Pagination, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import { apiVersion, authenticate } from "~/shopify.server";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const ITEMS_PER_PAGE = 10;
export const query = `
query Products($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      edges {
        cursor
        node {
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
      }
    }
  }
`;



export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request)
  const { shop, accessToken } = session;
  const query_base_url = `https://${shop}/admin/api/${apiVersion}/graphql.json`; 

  try {
    const response = await fetch(query_base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken!
      },
      body: JSON.stringify({
        query: query,
        variables: { first: 10, after: null } // Initial request fetches first 10 products
      })
    });

    if (response.ok) {



      const data = await response.json()
      console.log(data, 'old_data')


      const { data: { products: { edges } } } = data;
      const { data: { products: { pageInfo } } } = data;
      return { 
        products: edges, 
        pageInfo: pageInfo, 
        session_old: session, 
        request: request, 
        query_base_url: query_base_url, 
        accessToken: accessToken  
      }
    }


    return null
  } catch (err) {
    console.log(err)
  }
};



const Products = () => {

  const [currentPage, setCurrentPage] = useState(1); // Definir currentPage aquí
  const location = useLocation();



  /* Seleccion de items  */
  const [selectedItems, setSelectedItems] = useState([]);
  const handleCheckboxChange = (productId) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter(item => item !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
    console.log('products seleccionados', selectedItems)

  };
  /******** */

  const data: any = useLoaderData();

  console.log(data,'data__ddd');


  const products: any = data.products;
  const pageInfo: any = data.pageInfo;
  const session_old: any = data.old_session;

  
  const handlePagination =    async (direction: string, session_old: any) => {

    console.log(data.query_base_url,'data.query_base_url')
    console.log(data.accessToken, 'data_access_token')
    let afterCursor = null;
    if (direction === "next" && pageInfo.hasNextPage) {
      afterCursor = pageInfo.endCursor;
    } else if (direction === "previous" && pageInfo.hasPreviousPage) {
      afterCursor = pageInfo.startCursor;
    }
    console.log('afterCursor',afterCursor)

    if (afterCursor) {
      //const { shop, accessToken } = session_old;
      const response = await fetch(data.query_base_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": data.accessToken!
        },
        body: JSON.stringify({
          query: query,
          variables: { first: ITEMS_PER_PAGE, after: afterCursor } // Load next page
        })
      });
      if (response.ok) {
        const newData = await response.json();
        const { products: newProducts } = newData.data;
        setCurrentPage(direction === "next" ? currentPage + 1 : currentPage - 1);
        return newProducts.edges;
      }
    }
  };


  const currentProducts = products;


  const rows = currentProducts.map((product: any) => {
    const { node } = product;
    const { images, title, description, variants, id, collections } = node;
    const sku = variants.edges[0]?.node.sku || '';
    const stock = variants.edges[0]?.node.inventoryQuantity || '';
    const price = variants.edges[0]?.node.price || '';
    const imageSrc = images.edges[0]?.node.originalSrc || '';
    const category = collections.edges[0]?.node.title || '';

    return {
      imageSrc,
      title: title || '',
      description,
      sku,
      stock,
      id,
      price,
      category
    };

  }

  );


  /*
      const handlePagination = (newPage: number) => {
          setCurrentPage(newPage);
      };
      */

  return (
    <Page title="Products" fullWidth >
      <Card >
        <DataTable
          columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text']}
          headings={['Disponible a venta', 'Imagen', 'Nombre', 'SKU', 'Stock', 'price', 'Categoria', 'Descripción', 'ID']}
          rows={rows.map((product: any) => [
            <input
              type="checkbox"
              onChange={() => handleCheckboxChange(product.id)}
              checked={selectedItems.includes(product.id)}
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



        <div>
          <button onClick={() => handlePagination("previous", session_old)} disabled={!pageInfo.hasPreviousPage}>Previous</button>
          <button onClick={() => handlePagination("next", session_old)} disabled={!pageInfo.hasNextPage}>Next</button>
        </div>



        <button>Guardar seleccionados</button>
      </Card>
    </Page>
  );
};

export default Products;

