import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  DataTable,
} from "@shopify/polaris";


export default function AdditionalPage() {
  // Define el estado para almacenar los productos
  const [products, setProducts] = useState([]);

  // Simula la obtención de los productos (debes reemplazar esto con tu lógica real)
  useEffect(() => {
    // Aquí podrías hacer una llamada a una API, una consulta a la base de datos, etc.
    // Por ahora, simplemente vamos a simular algunos datos de ejemplo
    const fakeProducts = [
      { id: 1, name: 'Producto 1', price: '$10' },
      { id: 2, name: 'Producto 2', price: '$20' },
      { id: 3, name: 'Producto 3', price: '$30' },
    ];
    setProducts(fakeProducts);
  }, []);

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd">
                Pagina test de creacion
                using{" "}
                <Link
                  url="https://shopify.dev/docs/apps/tools/app-bridge"
                  target="_blank"
                  removeUnderline
                >
                  App Bridge
                </Link>
                .
              </Text>
              <Text as="p" variant="bodyMd">
                To create your own page and have it show up in the app
                navigation, add a page inside <Code>app/routes</Code>, and a
                link to it in the <Code>&lt;ui-nav-menu&gt;</Code> component
                found in <Code>app/routes/app.jsx</Code>.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Resources
              </Text>
              <List>
                <List.Item>
                  <Link
                    url="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
                    target="_blank"
                    removeUnderline
                  >
                    App nav best practices
                  </Link>
                </List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
      
      {/* Agrega la tabla de productos */}
      <Card sectioned>
        <DataTable
          columnContentTypes={['text', 'text', 'text']}
          headings={['ID', 'Nombre', 'Precio']}
          rows={products.map(product => Object.values(product))}
        />
      </Card>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
