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

  try {
    // 🔍 Check if a request already exists
    const querySpec = {
      query: "SELECT * FROM c WHERE c.studentId = @studentId AND c.coachId = @coachId",
      parameters: [
        { name: "@studentId", value: studentId },
        { name: "@coachId", value: coachId },
      ],
    };

    const { resources: existingRequests } = await container.items.query(querySpec).fetchAll();

    // 🧹 Delete any existing accepted or rejected requests
    for (const request of existingRequests) {
      if (request.status === "accepted" || request.status === "rejected") {
        await container.item(request.id, request.coachId).delete();
      } else if (request.status === "pending") {
        context.res = {
          status: 200,
          body: {
            message: "Join request already pending",
            id: request.id,
          },
        };
        return;
      }
    }

    // ✅ Send a new request
    const id = `${studentId}-${coachId}-${Date.now()}`;
    const newRequest = {
      id,
      studentId,
      coachId,
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    await container.items.create(newRequest);

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
