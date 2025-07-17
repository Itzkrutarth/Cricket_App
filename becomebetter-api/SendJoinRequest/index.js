const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
  const endpoint = process.env.COSMOS_DB_ENDPOINT;
  const key = process.env.COSMOS_DB_KEY;

  const client = new CosmosClient({ endpoint, key });
  const container = client.database("becomebetter").container("requests");

  const { studentId, coachId } = req.body;

  if (!studentId || !coachId) {
    context.res = {
      status: 400,
      body: "Missing studentId or coachId",
    };
    return;
  }

  const id = `${studentId}-${coachId}-${Date.now()}`;
  const request = {
    id,
    studentId,
    coachId,
    status: "pending",
    timestamp: new Date().toISOString(),
  };

  try {
    await container.items.create(request);

    context.res = {
      status: 200,
      body: { message: "Join request sent", id },
    };
  } catch (err) {
    context.log("❌ Failed to send request:", err.message);
    context.res = {
      status: 500,
      body: `Server error: ${err.message}`,
    };
  }
};
