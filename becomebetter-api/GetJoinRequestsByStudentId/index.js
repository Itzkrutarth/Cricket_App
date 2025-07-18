const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

const databaseId = "becomebetter";
const containerId = "requests";

const client = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
  const studentId = (req.query.studentId || "").trim().toLowerCase();

  if (!studentId) {
    context.res = {
      status: 400,
      body: "Missing or invalid studentId",
    };
    return;
  }

  try {
    const container = client.database(databaseId).container(containerId);

    const querySpec = {
      query: "SELECT * FROM c WHERE LOWER(c.studentId) = @studentId",
      parameters: [{ name: "@studentId", value: studentId }],
    };

    const { resources: requests } = await container.items
      .query(querySpec)
      .fetchAll();

    context.res = {
      status: 200,
      body: requests,
    };
  } catch (error) {
    context.log("❌ Error in GetJoinRequestsByStudentId:", error);
    context.res = {
      status: 500,
      body: `Internal Server Error: ${error.message}`,
    };
  }
};
