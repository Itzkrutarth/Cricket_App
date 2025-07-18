const { CosmosClient } = require("@azure/cosmos");

const COSMOS_CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING;
const DATABASE_ID = "becomebetter";
const CONTAINER_ID = "feedback"; // your feedback container name

module.exports = async function (context, req) {
  context.log("🔍 GetFeedbackByVideoId function triggered");

  const videoId = req.query.videoId;

  if (!videoId) {
    context.res = {
      status: 400,
      body: "Missing videoId in query",
    };
    return;
  }

  try {
    const client = new CosmosClient(COSMOS_CONNECTION_STRING);
    const container = client.database(DATABASE_ID).container(CONTAINER_ID);

    const querySpec = {
      query: "SELECT * FROM c WHERE c.videoId = @videoId",
      parameters: [{ name: "@videoId", value: videoId }],
    };

    const { resources: items } = await container.items.query(querySpec).fetchAll();

    if (items.length === 0) {
      context.res = {
        status: 404,
        body: "Feedback not found for given videoId",
      };
      return;
    }

    context.res = {
      status: 200,
      body: items[0], // return the first matching feedback
    };
  } catch (err) {
    context.log.error("❌ Failed to fetch feedback", err);
    context.res = {
      status: 500,
      body: "Internal Server Error",
    };
  }
};
