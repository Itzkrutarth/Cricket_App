const { CosmosClient } = require("@azure/cosmos");

const COSMOS_CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING;

module.exports = async function (context, req) {
  const coachEmail = req.query.coachEmail;

  if (!coachEmail) {
    context.res = {
      status: 400,
      body: "Missing required query parameter: coachEmail",
    };
    return;
  }

  try {
    const cosmosClient = new CosmosClient(COSMOS_CONNECTION_STRING);
    const db = cosmosClient.database("becomebetter");
    const container = db.container("annotations");

    const querySpec = {
      query: "SELECT * FROM c WHERE c.uploadedBy = @coachEmail",
      parameters: [{ name: "@coachEmail", value: coachEmail }],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    context.res = {
      status: 200,
      body: resources,
    };
  } catch (error) {
    context.log.error("❌ Error fetching annotations by coach:", error.message);
    context.res = {
      status: 500,
      body: "Failed to fetch annotations: " + error.message,
    };
  }
};
