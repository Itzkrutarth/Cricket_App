const { CosmosClient } = require("@azure/cosmos");

const COSMOS_CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING;

module.exports = async function (context, req) {
  const studentEmail = req.query.studentEmail;

  if (!studentEmail) {
    context.res = {
      status: 400,
      body: "Missing required query parameter: studentEmail",
    };
    return;
  }

  try {
    const cosmosClient = new CosmosClient(COSMOS_CONNECTION_STRING);
    const db = cosmosClient.database("becomebetter");
    const container = db.container("annotations");

    const querySpec = {
      query: "SELECT * FROM c WHERE c.recordedFor = @email",
      parameters: [{ name: "@email", value: studentEmail }],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    context.res = {
      status: 200,
      body: resources,
    };
  } catch (error) {
    context.log.error("❌ Error fetching annotations by student:", error.message);
    context.res = {
      status: 500,
      body: "Failed to fetch annotations: " + error.message,
    };
  }
};
