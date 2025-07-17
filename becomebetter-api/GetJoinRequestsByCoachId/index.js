const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
  const endpoint = process.env.COSMOS_DB_ENDPOINT;
  const key = process.env.COSMOS_DB_KEY;

  const client = new CosmosClient({ endpoint, key });
  const container = client.database("becomebetter").container("requests");

  const coachId = req.query.coachId;

  if (!coachId) {
    context.res = {
      status: 400,
      body: "Missing coachId",
    };
    return;
  }

  const query = {
    query: "SELECT * FROM c WHERE c.coachId = @coachId AND c.status = 'pending'",
    parameters: [{ name: "@coachId", value: coachId }],
  };

  try {
    const { resources } = await container.items.query(query).fetchAll();
    context.res = {
      status: 200,
      body: resources || [],
    };
  } catch (err) {
    context.log("❌ Error fetching requests:", err.message);
    context.res = {
      status: 500,
      body: `Internal Server Error: ${err.message}`,
    };
  }
};
