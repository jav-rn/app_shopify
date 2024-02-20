const { authenticate } = require("~/shopify.server");
const fetch = require("node-fetch");

const handler = async (req, res) => {
    if (req.method === "GET" && req.url === "/api/shopify/products") {
        const { session } = await authenticate.admin(req);
        const { shop, accessToken } = session;
        const query_base_url = `https://${shop}/admin/api/${apiVersion}/graphql.json`; // Ajusta la versión de la API según tu configuración
  
        try {
            const response = await fetch(query_base_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": accessToken,
                },
                body: JSON.stringify({
                    query: query,
                    variables: { first: 10, after: null },
                }),
            });
  
            if (response.ok) {
                const data = await response.json();
                res.status(200).json(data);
            } else {
                throw new Error("Error fetching products from Shopify API");
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(404).json({ error: "Route not found" });
    }
};
  
module.exports = handler;
