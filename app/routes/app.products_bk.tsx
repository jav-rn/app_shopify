import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, Layout, List, Page, DataTable, Pagination, Thumbnail } from "@shopify/polaris";
import { apiVersion, authenticate } from "~/shopify.server";
import { useState } from "react";

export const query = `
{
    products(first: 10) {
        edges {
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
                  inventoryQuantity,
                  price
                }
              }
            }
            collections(first: 1){
                edges{
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

    try {
        const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/graphql",
                "X-Shopify-Access-Token": accessToken!
            },
            body: query
        });

        if (response.ok) {
            const data = await response.json()
            const {
                data: {
                    products: { edges }
                }
            } = data;
            return edges
        }

        return null
    } catch (err) {
        console.log(err)
    }
};

const Products = () => {
    const products: any = useLoaderData();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentProducts = products.slice(firstItemIndex, lastItemIndex);

    const rows = currentProducts.map((product: any) => {
        const { node } = product;
        const { images, title, description, variants, id, collections } = node;
        const sku      = variants.edges[0]?.node.sku || '';
        const stock    = variants.edges[0]?.node.inventoryQuantity || '';
        const price    = variants.edges[0]?.node.price || '';
        const imageSrc = images.edges[0]?.node.originalSrc || '';
        const category = collections.edges[0]?.node.title || '';



        // Función para limpiar las etiquetas HTML
        /*
        const stripHtmlTags = (html: string) => {
            const cheerio = require('cheerio');
            const $ = cheerio.load(html);
            return $.text();
        };
        */

        console.log(products,'products')
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
    });

    const handlePagination = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <Page sectioned  >
            <Card sectioned >
                <DataTable  sectioned 


                    columnContentTypes={['text', 'text', 'text','text', 'text', 'text', 'text']}
                    headings={['Imagen', 'Nombre', 'SKU', 'Stock','price','Categoria','Descripción','ID']}
                    rows={rows.map((product: any) => [
                        <div>
                            <Thumbnail source={product.imageSrc} alt={product.title} size="large" />
                        </div>,
                        <div>{product.title}</div>,
                        <div>{product.sku}</div>,
                        <div>{product.stock}</div>,
                        <div>{product.price}</div>,
                        <div>{product.category}</div>,
                        <div>{product.description}</div>,
                        <div>{product.id}</div>,
                    ])}
                    style={{ fontSize: '14px', width: '100%', margin: '0 auto' }}
                />
                <Pagination
                    hasPrevious={currentPage !== 1}
                    onPrevious={() => handlePagination(currentPage - 1)}
                    hasNext={currentPage * itemsPerPage < products.length}
                    onNext={() => handlePagination(currentPage + 1)}
                />
            </Card>
        </Page>
    );
};

export default Products;

