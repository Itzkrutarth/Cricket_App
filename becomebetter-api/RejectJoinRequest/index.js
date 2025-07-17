const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
  const endpoint = process.env.COSMOS_DB_ENDPOINT;
  const key = process.env.COSMOS_DB_KEY;
  const client = new CosmosClient({ endpoint, key });

  const db = client.database("becomebetter");
  const requestContainer = db.container("requests");

  const { requestId } = req.body;

  if (!requestId) {
    context.res = { status: 400, body: "Missing requestId" };
    return;
  }

  try {
    // Use partition key (coachId) from requestId
    const coachId = requestId.split("-")[1];

    const { resource: request } = await requestContainer.item(requestId, coachId).read();

    if (!request) {
      context.res = { status: 404, body: "Request not found" };
      return;
    }

    request.status = "rejected";
    await requestContainer.item(requestId, coachId).replace(request);

    context.res = { status: 200, body: { message: "Request rejected" } };
  } catch (err) {
    context.log("❌ Error rejecting request:", err.message);
    context.res = { status: 500, body: `Internal Server Error: ${err.message}` };
  }
};
