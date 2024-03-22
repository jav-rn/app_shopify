import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Card, Layout, List, Page, DataTable, Thumbnail, useIndexResourceState, Button, TextField,    Banner } from "@shopify/polaris";
import { getPaginationVariables, Pagination } from '@shopify/hydrogen';
import { apiVersion, authenticate } from "~/shopify.server";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { json } from '@shopify/remix-oxygen';


export const query = `
query AllOrders(
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) {
    orders(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      edges {
        node {
          id
          name
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          createdAt
          customer {
            id
            displayName
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

export const loader: LoaderFunction = async ({ request }) => {
      const { session } = await authenticate.admin(request)
    const { shop, accessToken } = session;
    const query_base_url = `https://${shop}/admin/api/${apiVersion}/graphql.json`;
  
    const variables = getPaginationVariables(request, {
      pageBy: 4,
    });

  
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

        console.log(data, 'orders')
  
  
       // const { data: { products } } = data;
  
        //console.log(products, 'data__')
        return {
        "test": "trest"
        }
      }
  
  
      return null
    } catch (err) {
      console.log(err)
    }
  };
  