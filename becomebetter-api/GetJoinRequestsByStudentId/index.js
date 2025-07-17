const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "becomebetter-db";
const containerId = "requests";

module.exports = async function (context, req) {
  try {
    const studentId = (req.query.studentId || "").trim().toLowerCase();

    if (!studentId) {
      context.res = {
        status: 400,
        body: "Missing or invalid studentId",
      };
      return;
    }

    const container = client.database(databaseId).container(containerId);

    const querySpec = {
      query: "SELECT * FROM c WHERE LOWER(c.studentId) = @studentId",
      parameters: [{ name: "@studentId", value: studentId }],
    };

    const { resources: requests } = await container.items.query(querySpec).fetchAll();

    context.res = {
      status: 200,
      body: requests,
    };
  } catch (error) {
    console.error("❌ Error fetching join requests by studentId:", error.message);
    context.res = {
      status: 500,
      body: "Internal Server Error",
    };
  }
};
