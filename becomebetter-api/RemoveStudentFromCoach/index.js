const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "becomebetter";
const containerId = "users";

module.exports = async function (context, req) {
  const coachId = req.body.coachId;
  const studentId = req.body.studentId;

  if (!coachId || !studentId) {
    context.res = {
      status: 400,
      body: "Missing coachId or studentId in request.",
    };
    return;
  }

  const client = new CosmosClient({ endpoint, key });
  const container = client.database(databaseId).container(containerId);

  try {
    const { resource: coachDoc } = await container.item(coachId, coachId).read();

    if (!coachDoc) {
      context.res = {
        status: 404,
        body: "Coach not found.",
      };
      return;
    }

    coachDoc.students = (coachDoc.students || []).filter((id) => id !== studentId);

    await container.item(coachId, coachId).replace(coachDoc);

    context.res = {
      status: 200,
      body: { message: "Student removed from coach successfully", updatedCoach: coachDoc },
    };
  } catch (err) {
    context.log("RemoveStudentFromCoach error:", err.message);
    context.res = {
      status: 500,
      body: "Failed to update coach document.",
    };
  }
};
